from django.http import JsonResponse,HttpResponse
from .models import Truck, Inspection,Inspector
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from google.cloud import vision
from .report import ReportGenerator
from .summarizer import summarize
import io
from .decode import decode_and_save_images
import json
from django.http import FileResponse
from .predict import predict
from datetime import datetime


@csrf_exempt
def concat_header(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data["DATA"] = {}
        print(data)
        path = r"C:\Users\laksh\OneDrive\Desktop\Caterpillar\base\backend\report.py"
        with open(path, 'w') as file:
            json.dump(data, file, indent=4)
        
        HttpResponse(status=200) 
@csrf_exempt
def concat(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        with open('session.json', 'w') as file:
            filedata = json.load(file)
        filedata.append(data)

@csrf_exempt
def report(request):
    if request.method == 'POST':
        # Parse JSON data from the request body
        
        data = json.loads("session.json")

        # Extract and print data
        data["HEADER"]["DATE&TIME"] = datetime.now()
        truck_serial_number = data.get("HEADER", {}).get("TSN")
        truck_model = data.get("HEADER", {}).get("TM")
        
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
        images = decode_and_save_images(data.get("IMAGES", {}))
        

        text_data = {
            "HEADERS": {
                "Truck Serial Number": truck_serial_number,
                "Truck Model": truck_model,
                "Date and Time": data.get("HEADER").get("DATE&TIME"),
                "Location": data.get("HEADER").get("LOCATION"),
                "Service Meter Hours": data.get("HEADER").get("SMH"),
                "Client Name": data.get("HEADER").get("CLIENTNAME"),
                "CAT Id": data.get("HEADER").get("CATID")
            },
            "TIRES": {
                "Left Front Tire": {
                    "Pressure": data_dict.get("TIRES").get("LFT").get("Pressure"),
                    "Condition": data_dict.get("TIRES").get("LFT").get("Condition"),
                },
                "Right Front Tire": {
                    "Pressure": data_dict.get("TIRES").get("RFT").get("Pressure"),
                    "Condition": data_dict.get("TIRES").get("RFT").get("Condition"),
                },
                "Left Rear Tire": {
                    "Pressure": data_dict.get("TIRES").get("LRT").get("Pressure"),
                    "Condition": data_dict.get("TIRES").get("LRT").get("Condition"),
                },
                "Right Rear Tire": {
                    "Pressure": data_dict.get("TIRES").get("RRT").get("Pressure"),
                    "Condition": data_dict.get("TIRES").get("RRT").get("Condition"),
                }
                },
            "BATTERY": {
                "Make": data_dict.get("BATTERY").get("Make"),
                "Replacement Date": data_dict.get("BATTERY").get("RD"),
                "Voltage": data_dict.get("BATTERY").get("Voltage"),
                "Water Level": data_dict.get("BATTERY").get("Water Level"),
                "Condition": {
                    "Damage": data_dict.get("BATTERY").get("Condition").get("Damage"),
                },
                "Leak / Rust": data_dict.get("BATTERY").get("LR"),
                },
            "EXTERIOR": {
                "Rust, Dent and Damage": {
                    "Present": data_dict.get("EXTERIOR").get("RND").get("Present")
                },
                "Oil Leak in Suspension": data_dict.get("EXTERIOR").get("OLS")
                },
            "BRAKES": {
                "Brake Fluid Level": data_dict.get("BRAKES").get("BFL"),
                "Front Brake Condition": data_dict.get("BRAKES").get("FBC"),
                "Rear Brake Condition": data_dict.get("BRAKES").get("RBC"),
                "Emergency Brake": data_dict.get("BRAKES").get("EB")
                },
            "ENGINE": {
                "Rust Dent or Damage": {
                    "Present": data_dict.get("ENGINE").get("RND").get("Present")
                },
                "Engine Oil Condition": data_dict.get("ENGINE").get("EOC"),
                "Engine Oil Color": data_dict.get("ENGINE").get("EOColor"),
                "Brake Fluid Condition": data_dict.get("ENGINE").get("BFC"),
                "Brake Fluid Color": data_dict.get("ENGINE").get("BFColor"),
                "Oil Leak in Engine": data_dict.get("ENGINE").get("OLE")
                },
            "Voice of Customer": {
                "Feedback": data_dict.get("Voice of Customer").get("Feedback")
            }
        }
        texts = summarize(text_data)
        print(texts)

        dataforreport = {
            "HEADERS":data.get("HEADER"),
            "TIRES":data_dict.get("TIRES"),
            "BATTERY":data_dict.get("BATTERY"),
            "EXTERIOR":data_dict.get("EXTERIOR"),
            "ENGINE":data_dict.get("ENGINE"),
            "BRAKES":data_dict.get("BRAKES"),
            "Voice of Customer":data_dict.get("Voice of Customer"),
        }
        path=rf"C:\Users\laksh\OneDrive\Desktop\Caterpillar\base\backend\inspections\inspection_data_{count}.pdf"

        base = ReportGenerator(
            path=path,
            data=dataforreport,
            images=images,
            texts=texts
        )
        base.build()
        response = FileResponse(open(path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="inspection_data_{count}.pdf"'
        return response
    
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


@csrf_exempt
def failure_prediction(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        response = predict(data)
        return JsonResponse(response)