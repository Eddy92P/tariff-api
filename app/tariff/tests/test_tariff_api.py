"""
Tests for Tariff APIs.
"""
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Tariff, Architect, Project, Header_Tariff

from tariff.serializers import HeaderTariffSerializer

TARIFF_URL = reverse('tariff:header_tariff-list')


def create_architect(**params):
    """Create and return a sample architect."""
    defaults = {
        'name': 'Test',
        'last_name': 'Architect',
        'address': '123 Main St',
        'register_number': '1234567',
        'phone_number': '65897813',
        'ci': '12345679',
    }
    defaults.update(params)
    return Architect.objects.create(**defaults)


def create_header_tariff(architect=None, **params):
    """Create and return a sample header tariff."""
    defaults = {
        'total_tariff_amount': Decimal('500.00'),
        'tariff_date': '2023-10-01',
    }
    if architect is None:
        architect = create_architect()
    defaults.update(params)

    return Header_Tariff.objects.create(architect=architect, **defaults)


def create_project(**params):
    """Create and return a sample project."""
    defaults = {
        'name': 'Test Project',
        'cost': Decimal('1500.50'),
        'percentaje_visa': 10,
    }
    defaults.update(params)

    return Project.objects.create(**defaults)


def create_tariff(**params):
    """Create and return a sample tariff."""
    defaults = {
        'header': None,
        'project': None,
        'surface': Decimal('100.00'),
        'have_visa': True,
    }
    defaults.update(params)

    return Tariff.objects.create(**defaults)


class PublicTariffAPITests(TestCase):
    """Test Tariff API for unauthenticated users."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test authentication is required for tariff API."""
        res = self.client.get(TARIFF_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTariffAPITests(TestCase):
    """Test Tariff API for authenticated users."""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='example@test.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.architect = create_architect()
        self.project = create_project()
        self.header = create_header_tariff(architect=self.architect)
        self.tariff = create_tariff(header=self.header, project=self.project)
        
    def test_retrieve_tariffs(self):
        """Test retrieving a list of headers with tariffs."""
        res = self.client.get(TARIFF_URL)

        headers = Header_Tariff.objects.all().order_by('-id')
        serializer = HeaderTariffSerializer(headers, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_header_tariff(self):
        """Test creating a header tariff."""
        payload = {
            'total_tariff_amount': Decimal('500.00'),
            'tariff_date': '2023-10-01',
            'architect': {
                'name': 'Test',
                'last_name': 'Architect',
                'address': '123 Main St',
                'register_number': '7654321',
                'phone_number': '65897814',
                'ci': '98765432',
            },
            'tariffs': [
                {
                    'surface': Decimal('150.00'),
                    'have_visa': True,
                    'project': {
                        'name': 'New Project',
                        'cost': Decimal('2000.50'),
                        'percentaje_visa': 15,
                    }
                }
            ]
        }

        res = self.client.post(TARIFF_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        header = Header_Tariff.objects.get(id=res.data['id'])
        for key, value in payload.items():
            if key not in ['architect', 'tariffs']:
                if isinstance(value, Decimal):
                    self.assertEqual(value, getattr(header, key))
                else:
                    self.assertEqual(str(value), str(getattr(header, key)))
