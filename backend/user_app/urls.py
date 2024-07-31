from django.urls import path
from .views import CheckEmailView, ContactView, ProfileImageView

urlpatterns = [
    path('api/v1/user/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('api/v1/user/contact/', ContactView.as_view(), name='contact'),
    path('api/v1/user/profile/imageURL/',
         ProfileImageView.as_view(), name='contact'),
]
