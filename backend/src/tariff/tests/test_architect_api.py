"""
Tests for Architect APIs.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Architect

from tariff.serializers import ArchitectSerializer

ARCHITECT_URL = reverse('tariff:architect-list')


def architect_detail_url(architect_id):
    """Return architect detail URL."""
    return reverse('tariff:architect-detail', args=[architect_id])


def create_architect(**params):
    """Create and return a sample architect."""
    defaults = {
        'name': 'Test',
        'last_name': 'Architect',
        'address': '123 Main St',
        'register_number': '123456',
        'phone_number': '65897812',
        'ci': '12345678',
    }

    defaults.update(params)
    return Architect.objects.create(**defaults)


def create_user(**params):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(**params)


class PublicArchitectAPITests(TestCase):
    """Test Architect API for unauthenticated users."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test authentication is required for architect API."""
        res = self.client.get(ARCHITECT_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateArchitectAPITests(TestCase):
    """Test Architect API for authenticated users."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user(
            email='example@test.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_retrieve_architects(self):
        """Test retrieving a list of architects."""
        create_architect(
            register_number='123456',
            phone_number='65689875',
            ci='12345678'
        )
        create_architect(
            register_number='1234567',
            phone_number='65689876',
            ci='12345679'
        )

        res = self.client.get(ARCHITECT_URL)

        architects = Architect.objects.all().order_by('-id')
        serializer = ArchitectSerializer(architects, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_architect(self):
        """Test creating a new architect."""
        payload = {
            'name': 'New',
            'last_name': 'Architect',
            'address': '456 Elm St',
            'register_number': '654321',
            'phone_number': '12345678',
            'ci': '87654321',
        }
        res = self.client.post(ARCHITECT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        architect = Architect.objects.get(id=res.data['id'])
        for key in payload:
            self.assertEqual(getattr(architect, key), payload[key])

    def test_partial_update_architect(self):
        """Test partially updating an architect."""
        architect = create_architect(
            name='Old',
            last_name='Architect',
            register_number='123456',
            phone_number='98765432',
            ci='12345678'
        )
        payload = {'name': 'Updated'}
        url = architect_detail_url(architect.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        architect.refresh_from_db()
        self.assertEqual(architect.name, payload['name'])

    def test_full_update_architect(self):
        """Test fully updating an architect."""
        architect = create_architect(
            name='Old',
            last_name='Architect',
            address='123 Main St',
            register_number='123456',
            phone_number='98765432',
            ci='12345678'
        )
        payload = {
            'name': 'Updated',
            'last_name': 'Architect',
            'address': '789 Oak St',
            'register_number': '654321',
            'phone_number': '87654321',
            'ci': '87654321',
        }
        url = architect_detail_url(architect.id)

        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        architect.refresh_from_db()
        for key in payload:
            self.assertEqual(getattr(architect, key), payload[key])

    def test_not_delete_architect(self):
        """Test that architect cannot be deleted."""
        architect = create_architect()
        url = architect_detail_url(architect.id)

        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertTrue(Architect.objects.filter(id=architect.id).exists())
