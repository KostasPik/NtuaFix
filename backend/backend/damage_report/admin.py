from django.contrib import admin
from .models import DamageReport, DamageReportStatus, DamageType

# Register your models here.





class DamageReportAdmin(admin.ModelAdmin):
    list_display = ['damage_report_name', 'damage_status','created_at']
    # fields = ["report_id", "image", "status"]
    search_fields = ('damage_status', )

    # def get_readonly_fields(self, request, obj=None):
    #     if obj: # editing an existing object
    #         return self.readonly_fields + ('report_id',)
    #     return self.readonly_fields


admin.site.register(DamageReport, DamageReportAdmin)
admin.site.register(DamageReportStatus)
admin.site.register(DamageType)