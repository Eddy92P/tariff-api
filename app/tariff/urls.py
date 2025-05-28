"""
URL mapping for the project API.
"""
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from tariff import views

router = DefaultRouter()
router.register('projects', views.ProjectViewSet)
router.register('architects', views.ArchitectViewSet)
router.register('headers', views.HeaderTariffViewSet)

app_name = 'tariff'

urlpatterns = [
    path('', include(router.urls)),
]
