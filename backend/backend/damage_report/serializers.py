from .models import DamageReport, DamageReportStatus, DamageType
from rest_framework import serializers



class DamageReportListSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = DamageReport
        fields = ['report_id', 'damage_type', 'damage_status', 'created_at', 'image']
        read_only_fields = fields



class DamageReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = DamageReport
        fields = ['report_id', 'damage_type', 'damage_status', 'created_at', 'image', 'description', 'latitude', 'longitude', 'damage_report_notes']
        read_only_fields = fields

        