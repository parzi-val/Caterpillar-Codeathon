# myapp/urls.py

from django.urls import path, include
from .views import headers

urlpatterns = [
    path('headers/',headers.as_view())
]