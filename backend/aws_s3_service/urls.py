from django.urls import path
from .views import UploadFileToS3, SNSNotificationView

urlpatterns = [
    path('api/v1/s3/upload/', UploadFileToS3.as_view(), name='upload-s3'),
    path('api/v1/s3/notification/',
         SNSNotificationView.as_view(), name='notification-s3'),
]
