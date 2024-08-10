# myapp/urls.py

from django.urls import path, include
from .views import verify_token

urlpatterns = [
    path('login/',verify_token)
]
