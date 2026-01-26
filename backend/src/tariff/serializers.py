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

    class Meta:
        model = Tariff
        fields = ['id', 'project', 'surface', 'have_visa']
        read_only_fields = ['id']


class HeaderTariffSerializer(serializers.ModelSerializer):
    """Serializer for header tariff objects."""
    architect = ArchitectSerializer(read_only=True)
    architect_id = serializers.PrimaryKeyRelatedField(
        queryset=Architect.objects.all(),
        source='architect',
        write_only=True
    )
    tariffs = TariffSerializer(many=True, read_only=True)
    tariffs_data = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Header_Tariff
        fields = [
            'id',
            'total_tariff_amount',
            'tariff_date',
            'architect',
            'architect_id',
            'tariffs',
            'tariffs_data'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        """Create a header tariff."""
        tariffs_data = validated_data.pop('tariffs_data', [])
        
        header = Header_Tariff.objects.create(**validated_data)

        for tariff_data in tariffs_data:
            project_id = tariff_data.pop('project_id')
            project = Project.objects.get(id=project_id)
            Tariff.objects.create(
                header=header,
                project=project,
                **tariff_data
            )

        return header
