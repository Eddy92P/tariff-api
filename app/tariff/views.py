"""
Views for project API.
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Project, Architect, Header_Tariff
from tariff import serializers


class ProjectViewSet(viewsets.ModelViewSet):
    """Manage project APIs"""
    serializer_class = serializers.ProjectSerializer
    queryset = Project.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch']

    def get_queryset(self):
        """Retrieve the projects ordered."""
        return self.queryset.order_by('-id')


class ArchitectViewSet(viewsets.ModelViewSet):
    """Manage architect APIs"""
    serializer_class = serializers.ArchitectSerializer
    queryset = Architect.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch']

    def get_queryset(self):
        """Retrieve the architects ordered."""
        return self.queryset.order_by('-id')


class HeaderTariffViewSet(viewsets.ModelViewSet):
    """Manage header tariff APIs"""
    serializer_class = serializers.HeaderTariffSerializer
    queryset = Header_Tariff.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        """Retrieve the header tariffs ordered."""
        return self.queryset.order_by('-id')
