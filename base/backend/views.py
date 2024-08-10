# myapp/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Truck, Inspection
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.permissions import IsAuthenticated

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'You are authenticated!'})



class headers(APIView):
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

