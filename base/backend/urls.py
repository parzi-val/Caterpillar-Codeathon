# myapp/urls.py

from django.urls import path, include
from .views import report,ocr,concat_header,concat
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('report/',report),
    path('ocr/',ocr),
    path('concat_header/',concat_header)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

