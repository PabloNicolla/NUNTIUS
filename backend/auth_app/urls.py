from .views import PublicView, PrivateView
from django.urls import path, include
from .views import GoogleLogin, CustomLoginView, CustomTokenRefreshView, CustomRegisterView
from dj_rest_auth.views import PasswordResetConfirmView

# TODO fix clash /login

urlpatterns = [
    path('public/', PublicView.as_view(), name='public'),
    path('private/', PrivateView.as_view(), name='private'),

    path('accounts/', include('allauth.urls')),
    path('api/v1/auth/', include('dj_rest_auth.urls')),
    #     path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/v1/auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/v1/auth/password/reset/confirm/<uidb64>/<token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('api/v1/auth/login/', CustomLoginView.as_view(), name='custom_login'),
    path('api/v1/auth/register/',
         CustomRegisterView.as_view(), name='custom_register'),
    path('api/v1/auth/jwt/refresh/', CustomTokenRefreshView.as_view(),
         name='custom_token_refresh'),
]
