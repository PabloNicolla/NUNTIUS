from .views import PublicView, PrivateView
from django.urls import path, include
from .views import GoogleLogin, CustomLoginView, CustomTokenRefreshView
from dj_rest_auth.views import PasswordResetConfirmView

urlpatterns = [
    path('public/', PublicView.as_view(), name='public'),
    path('private/', PrivateView.as_view(), name='private'),

    path('accounts/', include('allauth.urls')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('dj-rest-auth/password/reset/confirm/<uidb64>/<token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('api/auth/login/', CustomLoginView.as_view(), name='custom_login'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(),
         name='custom_token_refresh'),
]
