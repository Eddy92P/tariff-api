"""
Views for project API.
"""
from rest_framework import viewsets, filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import Tariff, Header_Tariff
from django.views import View
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML
from django.http import HttpResponse, Http404
from datetime import datetime


from core.models import Project, Architect, Header_Tariff
from tariff import serializers


class ProjectViewSet(viewsets.ModelViewSet):
    """Manage project APIs"""
    serializer_class = serializers.ProjectSerializer
    queryset = Project.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch']
    filter_backends = [filters.SearchFilter]
    search_fields = ['id', 'name']

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
    
    
class PDFView(View):
    """Generate PDF"""
    def get(self, request, *args, **kwargs):
        tariff_id = self.kwargs.get('id')
        try:
            tariff = Header_Tariff.objects.get(id=tariff_id)
        except Header_Tariff.DoesNotExist:
            raise Http404("Arancel no encontrado")
        
        architect_full_name = f"{tariff.architect.name} {tariff.architect.last_name}"
        today = datetime.now()
        context = {
            'title': 'Comprobante de arancel',
            'architect': architect_full_name,
            'tariff': tariff,
            'today': today,
        }
        html_string = render_to_string('tariff.html', context)

        html = HTML(string=html_string, base_url=request.build_absolute_uri('/'))

        pdf_file = html.write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{architect_full_name}.pdf"'
        return response
        
