"""
Serializers for project API.
"""
from rest_framework import serializers

from core.models import Project, Architect, Header_Tariff, Tariff


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for project objects."""

    class Meta:
        model = Project
        fields = ['id', 'name', 'cost', 'percentaje_visa']
        read_only_fields = ['id']


class ArchitectSerializer(serializers.ModelSerializer):
    """Serializer for architect objects."""

    class Meta:
        model = Architect
        fields = [
            'id',
            'name',
            'last_name',
            'address',
            'register_number',
            'phone_number',
            'ci',
        ]
        read_only_fields = ['id']


class TariffSerializer(serializers.ModelSerializer):
    """Serializer for tariff objects."""
    project = ProjectSerializer()

    class Meta:
        model = Tariff
        fields = ['id', 'project', 'surface', 'have_visa']
        read_only_fields = ['id']


class HeaderTariffSerializer(serializers.ModelSerializer):
    """Serializer for header tariff objects."""
    architect = ArchitectSerializer()
    tariffs = TariffSerializer(many=True)

    class Meta:
        model = Header_Tariff
        fields = [
            'id',
            'total_tariff_amount',
            'tariff_date',
            'architect',
            'tariffs'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        """Create a header tariff."""
        architect_data = validated_data.pop('architect', {})
        tariffs_data = validated_data.pop('tariffs', [])

        architect, _ = Architect.objects.get_or_create(**architect_data)

        header = Header_Tariff.objects.create(
            architect=architect,
            **validated_data
        )

        for tariff_data in tariffs_data:
            project_data = tariff_data.pop('project')
            project, _ = Project.objects.get_or_create(**project_data)
            Tariff.objects.create(
                header=header,
                project=project,
                **tariff_data
            )

        return header
