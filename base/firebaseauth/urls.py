# myapp/urls.py

from django.urls import path, include
from .views import login_view

urlpatterns = [
    path('login/',login_view)
]
