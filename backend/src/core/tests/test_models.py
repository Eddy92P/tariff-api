"""
Tests for models in the app.
"""
from decimal import Decimal

from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


def create_project(
        name='Test Project',
        cost=Decimal('1000.00'),
        percentaje_visa=0.0
):
    """Create and returns a project."""
    return models.Project.objects.create(
        name=name,
        cost=cost,
        percentaje_visa=percentaje_visa
    )


def create_architect(
        name='Test',
        last_name='Architect',
        address='123 Main St',
        register_number='1234567',
        phone_number='65897813',
        ci='12345679',
):
    """Create and returns an architect."""
    return models.Architect.objects.create(
        name=name,
        last_name=last_name,
        address=address,
        register_number=register_number,
        phone_number=phone_number,
        ci=ci
    )


def create_header_tariff(
        total_tariff_amount=Decimal('500.00'),
        tariff_date='2023-10-01',
        architect=None
):
    """Create and returns a header tariff."""
    return models.Header_Tariff.objects.create(
        total_tariff_amount=total_tariff_amount,
        tariff_date=tariff_date,
        architect=architect
    )


class ModelTests(TestCase):
    """Test models."""
    def test_create_user_with_email_successful(self):
        """Test creating a user with an email is successful."""
        email = 'test@example.com'
        password = 'testpass123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized."""
        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com']
        ]
        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(email, 'test123')
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test creating user without an email raises error."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'test123')

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            'test@example.com',
            'test123'
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_project(self):
        """Test creating a project."""
        project = create_project()

        self.assertEqual(str(project), f"{project.name}")

    def test_create_architect(self):
        """Test creating an architect."""
        architect = create_architect()

        self.assertEqual(
            str(architect),
            f"{architect.name} {architect.last_name}"
        )

    def test_create_header_tariff(self):
        """Test creating a header tariff."""
        architect = create_architect()
        header_tariff = create_header_tariff(architect=architect)

        self.assertEqual(
            str(header_tariff),
            (
                f"Tariff on {header_tariff.tariff_date} "
                f"by {header_tariff.architect.name} "
                f"{header_tariff.architect.last_name}"
            )
        )

    def test_tariff(self):
        """Test creating a tariff."""
        project = create_project()
        architect = create_architect()
        header_tariff = create_header_tariff(architect=architect)

        tariff = models.Tariff.objects.create(
            surface=Decimal('100.00'),
            have_visa=True,
            project=project,
            header=header_tariff,
            tariff_amount=Decimal('100.00')
        )

        self.assertEqual(
            str(tariff),
            (
                f"Tariff for {tariff.project.name} "
                f"on {tariff.header.tariff_date} is {tariff.tariff_amount}"
            )
        )
