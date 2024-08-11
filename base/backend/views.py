import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Truck, Inspection,Inspector
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from google.cloud import vision
from .report import ReportGenerator
import io
import json


@csrf_exempt
def report(request):
    if request.method == 'POST':
        # Parse JSON data from the request body
        try:
            data = json.loads(request.body)
            print(data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Extract and print data
        truck_serial_number = data.get("HEADER", {}).get("TSN")
        truck_model = data.get("HEADER", {}).get("TM")
        print(truck_serial_number, truck_model)
        
        # Get or create Truck instance
        truck, created = Truck.objects.get_or_create(
            truck_serial_number=truck_serial_number,
            truck_model=truck_model
        )
        
        # Get or create Inspector instance
        inspector_id = data.get("HEADER", {}).get("IID")
        inspector_name = data.get("HEADER", {}).get("INAME")
        inspector, created = Inspector.objects.get_or_create(
            inspector_id=inspector_id,
            inspector_name=inspector_name
        )
        
        # Create JSON file
        count = Inspection.objects.count()
        json_file_name = f'inspection_data_{count}.json'
        data_dict = data.get("DATA", {})
        json_string = json.dumps(data_dict, indent=4)
        json_file = io.BytesIO(json_string.encode('utf-8'))
        
        # Create Inspection instance
        inspection = Inspection.objects.create(
            truck=truck,
            inspector=inspector,
            location=data.get("HEADER", {}).get("LOCATION"),
            service_meter_hours=data.get("HEADER", {}).get("SMH"),
            customer_name=data.get("HEADER", {}).get("CLIENTNAME"),
            cat_customer_id=data.get("HEADER", {}).get("CATID"),
            details=ContentFile(json_file.read(), json_file_name)
        )
        inspection.save()

        # Generate report
        images = data.get("IMAGES", {})
        texts = None  # Update as needed
        
        base = ReportGenerator(
            path=f"base/backend/inspections/pdfs/inspection_data_{count}.pdf",
            data=data_dict,
            images=images,
            texts=texts
        )
        response = {
            'truck_serial_number': truck_serial_number,
            'truck_model': truck_model,
        }
        return JsonResponse(response)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

    



client = vision.ImageAnnotatorClient()

@csrf_exempt
def ocr(request):
    if request.method == 'POST':
        if 'file' in request.FILES:
            file = request.FILES['file']
            image = file.read()
            image = vision.Image(content=image)
            response = client.text_detection(image=image)
            texts = response.text_annotations
            detected_text = texts[0].description if texts else 'No text detected'
            return JsonResponse({'text': detected_text})
    
    return JsonResponse({'error': 'No file uploaded or invalid request'}, status=400)