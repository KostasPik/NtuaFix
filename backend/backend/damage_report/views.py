from django.shortcuts import render
from .serializers import DamageReportListSerializer, DamageReportSerializer
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from datetime import datetime
from .models import DamageReport, DamageReportStatus
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.

PER_PAGE = 15

@api_view(['GET'])
def get_reports(request):
    # Order by
    # Time Descending = 1
    # Time Ascending = 2

    order_by = int(request.query_params.get('order_by', 1))
    page = int(request.query_params.get('page', 1))
    damage_type = request.query_params.get('damage_type', None)
    damage_status = request.query_params.get('damage_status', None)

    reports = DamageReport.objects.select_related('damage_type', 'damage_status')

    if damage_type:
        reports = reports.filter(damage_type=damage_type)

    if damage_status:
        reports = reports.filter(damage_status=damage_status)

    if order_by == 1:
        reports = reports.order_by('-created_at')
    else:
        reports = reports.order_by('created_at')


    paginator = Paginator(reports, per_page=PER_PAGE)

    try:
        paged_reports = paginator.get_page(int(page))
    except PageNotAnInteger:
        paged_reports = paginator.page(1)
    except EmptyPage:
        paged_reports = []

    reports_json = DamageReportListSerializer(paged_reports, many=True, read_only=True,context={"request": request})
    total_events = reports.count()
    
    if total_events % PER_PAGE != 0:
        total_pages = int(total_events/PER_PAGE) + 1
    else:
        total_pages = int(total_events/PER_PAGE)

    return Response({
        'error': False,
        'data': reports_json.data,
        'total_pages': total_pages
        })



@api_view(['GET'])
def get_report(request):

    report_id = request.query_params.get('report_id', None)
    print(report_id)
    if not report_id:
        return Response({
            'error': True,
            'data': {
                'msg': 'Invalid report_id'
            }
        })
    
    try:
        report_id = int(report_id)
    except:
        return Response({
            'error': True,
            'data': {
                'msg': 'Invalid report_id'
            }
        })

    report = DamageReport.objects.filter(report_id=report_id).first()
    
    if not report:
        return Response({
            'error': True,
            'data': {
                'msg': 'Damage report with such report_id does not exist.'
            }
        })
    
    report_json = DamageReportSerializer(report, many=False, read_only=True, context={"request": request})

    return Response({
        'error': False,
        'data': report_json.data,
    })

import json
@api_view(['POST'])
def update_damage_report(request):
    data = json.loads(request.body)
    damage_report_id = data['reportID']
    new_damage_report_status = data['new_report_status']
    new_damage_report_notes = data['new_damage_report_notes']

    if not damage_report_id:
        return Response({
            'error': True,
            'data': {
                'msg': 'Invalid Report ID'
            }
        })
    
    try:
        damage_report_id = int(damage_report_id)
    except:
        return Response({
            'error': True,
            'data' : {
                'msg': 'Invalid Report ID'
            }
        })
    
    if not new_damage_report_notes and not new_damage_report_status:
        return Response({
            'error': True,
            'data': {
                'msg': 'You must update at least one thing...'
            }
        })

    damage_report = DamageReport.objects.filter(report_id=damage_report_id).first()

    if not damage_report:
        return Response({
            'error': True,
            'data': {
                'msg': 'Report ID not found.'
            }
        })
    
    if new_damage_report_notes:
        new_damage_report_notes = new_damage_report_notes.strip()
    
    damage_report.damage_report_notes = new_damage_report_notes

    ## check if there is such a damage_status
    damage_status = DamageReportStatus.objects.filter(damage_status=new_damage_report_status).first()
    if not damage_status:
        return Response({
            'error': True,
            'data': {
                'msg': 'No such Damage Report Status.'
            }
        })
    
    damage_report.damage_status = damage_status
    damage_report.save()
    return Response({
        'error': False,
        'data': {
            'msg': 'Η αναφορά ενημερώθηκε επιτυχώς.'
        }
    })


@api_view(['DELETE'])
def delete_damage_report(request, report_id):
    try:
        instance = DamageReport.objects.get(report_id=report_id)
    except DamageReport.DoesNotExist:
        return Response({
            'error': True,
            'data': {
                'msg': 'Δεν υπάρχει αναφορά με αυτό το αναγνωριστικό.'
            }
        })
    
    instance.delete()

    return Response({
        'error': False,
        'data': {
            'msg': 'Η αναφορά διαγράφθηκε επιτυχώς.'
        }
    })