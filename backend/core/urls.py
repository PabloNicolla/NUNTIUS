from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("auth_app.urls")),
    path("", include("user_app.urls")),
    # path("", include("chat_app.urls")),
]
