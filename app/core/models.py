"""
Database models for the application.
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
    PermissionsMixin


class UserManager(BaseUserManager):
    """Manager for users."""
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a user with an email and password."""
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and return a superuser with an email and password."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username."""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Project(models.Model):
    """Project model."""
    name = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    percentaje_visa = models.FloatField(default=0.0, blank=False)

    def __str__(self):
        return f"{self.name}"


class Architect(models.Model):
    """Architect model."""
    name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    register_number = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=15, unique=True, blank=True)
    ci = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.name} {self.last_name}"


class Header_Tariff(models.Model):
    """"Header Tariff model."""
    total_tariff_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.0
    )
    tariff_date = models.DateField()
    architect = models.ForeignKey(
        Architect,
        on_delete=models.CASCADE,
        related_name='headers'
    )

    def __str__(self):
        return (
            f"Tariff on {self.tariff_date} "
            f"by {self.architect.name} "
            f"{self.architect.last_name}"
        )


class Tariff(models.Model):
    """Tariff model."""
    header = models.ForeignKey(
        Header_Tariff,
        on_delete=models.CASCADE,
        related_name='tariffs'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tariffs'
    )
    surface = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    have_visa = models.BooleanField(default=False)

    def __str__(self):
        return f"Tariff for {self.project.name} on {self.header.tariff_date}"
