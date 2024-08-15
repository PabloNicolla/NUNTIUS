from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("auth_app.urls")),
    path("", include("user_app.urls")),
    path("", include("aws_s3_service.urls")),
]
