from django.contrib import admin
from django.urls import path, include
from .views import GoogleLogin, CustomRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("auth.urls")),

    path('accounts/', include('allauth.urls')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('dj-rest-auth/registration/',
         CustomRegisterView.as_view(), name='rest_register'),
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]
