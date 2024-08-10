from firebase_admin import auth
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
def verify_token(request):
    token = request.headers.get('Authorization').split('Bearer ')[1]
    print(request)
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return JsonResponse({'status': 'success', 'uid': uid})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
