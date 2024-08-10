

# Register your models here.
from django.contrib import admin
from .models import Truck, Inspection
@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = ('truck_serial_number', 'truck_model')
    search_fields = ('truck_serial_number', 'truck_model')

@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ('truck', 'inspection_id', 'date_time_inspection', 'service_meter_hours', 'customer_name')
    list_filter = ('date_time_inspection',)
    search_fields = ('truck__truck_serial_number', 'customer_name')
