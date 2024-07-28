# urls.py
from .views import PublicView, PrivateView
from django.urls import path
from .views import RegisterView, LogoutView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('public/', PublicView.as_view(), name='public'),
    path('private/', PrivateView.as_view(), name='private'),
]
