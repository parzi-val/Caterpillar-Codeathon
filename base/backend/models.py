from django.db import models

#from django.contrib.gis.db import models as gis_models


class Inspector(models.Model):
    inspector_id = models.CharField(max_length=20,primary_key=True)
    inspector_name = models.CharField(max_length=255)

class Truck(models.Model):
    truck_serial_number = models.CharField(max_length=20,unique=True)
    truck_model = models.CharField(max_length=10)


class Inspection(models.Model):
    truck = models.ForeignKey(Truck, related_name='inspections',on_delete=models.CASCADE)
    inspection_id = models.AutoField(primary_key=True)
    inspector = models.ForeignKey(Inspector, related_name='inspections', on_delete=models.CASCADE) 
    date_time_inspection = models.DateTimeField(auto_now_add=True)
    location = models.TextField()
    #geo_location = gis_models.PointField(null=True,blank=True)
    service_meter_hours = models.DecimalField(max_digits=10,decimal_places=4)
    inspector_signature = models.ImageField(upload_to='signatures/')
    customer_name = models.CharField(max_length=255)
    cat_customer_id = models.CharField(max_length=50,unique=True)
    details = models.FileField(upload_to="inspections/")

