"""
Tests for project APIs.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Project

from tariff.serializers import ProjectSerializer

PROJECT_URL = reverse('tariff:project-list')


def detail_url(project_id):
    """Return tariff detail URL."""
    return reverse('tariff:project-detail', args=[project_id])


def create_project(**params):
    """Create and return a sample project."""
    defaults = {
        'name': 'Test Project',
        'cost': 1500.50,
        'percentaje_visa': 10
    }
    defaults.update(params)

    return Project.objects.create(**defaults)


def create_user(**params):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(**params)


class PublicProjectAPITests(TestCase):
    """Test Project API for unauthenticated users."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test authentication is required for project API."""
        res = self.client.get(PROJECT_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateProjectAPITests(TestCase):
    """Test Project API for authenticated users."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user(
            email='example@test.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_retrieve_projects(self):
        """Test retrieving a list of projects."""
        create_project()
        create_project()

        res = self.client.get(PROJECT_URL)

        projects = Project.objects.all().order_by('-id')
        serializer = ProjectSerializer(projects, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_project(self):
        """Test create a new project."""
        payload = {
            'name': 'New Project',
            'cost': 2000.00,
            'percentaje_visa': 15.5
        }

        res = self.client.post(PROJECT_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        project = Project.objects.get(id=res.data['id'])
        for key, value in payload.items():
            self.assertEqual(value, getattr(project, key))

    def test_partial_update_project(self):
        """Test partial update of a project."""
        project = create_project(name='Old Project', cost=1000.00)
        payload = {'name': 'Updated Project'}

        url = detail_url(project.id)
        res = self.client.patch(url, payload)

        project.refresh_from_db()
        self.assertEqual(project.name, payload['name'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_full_update_project(self):
        """Test full update of a project."""
        project = create_project(name='Old Project', cost=1000.00)
        payload = {
            'name': 'Updated Project',
            'cost': 2500.00,
            'percentaje_visa': 20
        }

        url = detail_url(project.id)
        res = self.client.put(url, payload)

        project.refresh_from_db()
        for key, value in payload.items():
            self.assertEqual(value, getattr(project, key))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_not_delete_project(self):
        """Test that project cannot be deleted via API."""
        project = create_project()

        url = detail_url(project.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertTrue(Project.objects.filter(id=project.id).exists())
