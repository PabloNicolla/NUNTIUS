from django.urls import path
from .views import CheckEmailView, ContactView, ProfileImageView, health_check

urlpatterns = [
    path('health/', health_check),
    path('api/v1/user/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('api/v1/user/contact/', ContactView.as_view(), name='contact'),
    path('api/v1/user/profile/imageURL/',
         ProfileImageView.as_view(), name='contact'),
]
