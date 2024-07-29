from django.urls import path
from .views import CheckEmailView

urlpatterns = [
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
]
