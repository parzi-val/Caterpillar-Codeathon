# myapp/urls.py

from django.urls import path, include
from .views import report,ocr
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('report/',report),
    path('ocr/',ocr)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

