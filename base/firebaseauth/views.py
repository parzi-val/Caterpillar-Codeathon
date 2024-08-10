from django.http import JsonResponse
from django.contrib.auth import authenticate, login

def login_view(request):
    id_token = request.POST.get('idToken')
    user = authenticate(request, id_token=id_token)
    
    if user:
        login(request, user)
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error'}, status=401)
