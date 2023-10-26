from django.urls import path
from .views import get_reports, get_report, update_damage_report


urlpatterns = [
   path('get_reports/', get_reports, name='Get Reports'),
   path('get_report/', get_report, name='Get Report'),
   path('update_damage_report/', update_damage_report, name='Update damage report'),
]
