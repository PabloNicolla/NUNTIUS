from django.urls import path
from .views import CheckEmailView, ContactView

urlpatterns = [
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
    path('contact/', ContactView.as_view(), name='contact'),
]
