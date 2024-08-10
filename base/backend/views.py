# myapp/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Truck, Inspection,Inspector
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.mixins import LoginRequiredMixin



class headers(LoginRequiredMixin,APIView):
    def post(self, request, format=None):
        data = request.data
        print(data)
        truck_serial_number = data.get("truck_serial_number")
        truck_model = data.get('truck_model')
        print(truck_serial_number,truck_model)
        truck,created = Truck.objects.get_or_create(
                        truck_serial_number=truck_serial_number,truck_model=truck_model)
        
        msg = "created" if created else "exists"

        response = {
            'truck_serial_number':truck_serial_number,
            'truck_model':truck_model,
            'message': msg
        }

        return Response(response)

