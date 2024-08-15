import requests
import json
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import status
from .serializers import UploadFileSerializer

import boto3
from botocore.exceptions import NoCredentialsError
import os
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID', "")
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY', "")
AWS_S3_REGION = os.getenv('AWS_S3_REGION', "")
YOUR_BUCKET_NAME = os.getenv('YOUR_BUCKET_NAME', "")


class UploadFileToS3(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        # Validate request data using the serializer
        serializer = UploadFileSerializer(data=request.data)
        if serializer.is_valid():
            # Extract validated data
            file_name = serializer.validated_data['file_name']
            file_type = serializer.validated_data['file_type']

            # S3 client setup and URL generation
            s3_client = boto3.client('s3', region_name=AWS_S3_REGION,
                                     aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
            try:
                presigned_url = s3_client.generate_presigned_url(
                    'put_object',
                    Params={
                        'Bucket': YOUR_BUCKET_NAME,
                        'Key': file_name,
                        'ContentType': file_type
                    },
                    ExpiresIn=3600
                )
                return Response({"message": "Success", "presigned_url": presigned_url}, status=status.HTTP_200_OK)
            except NoCredentialsError:
                return Response({"message": "Failed to create presigned url", "presigned_url": ""}, status=status.HTTP_204_NO_CONTENT)
        else:
            # Handle validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SNSNotificationView(APIView):

    def post(self, request):
        # Parse the incoming SNS message
        message_type = request.headers.get('x-amz-sns-message-type')
        full_message = json.loads(request.body)

        # Check if it's a SubscriptionConfirmation message
        if message_type == 'SubscriptionConfirmation':
            # Confirm the subscription by visiting the SubscribeURL
            subscribe_url = full_message['SubscribeURL']
            response = requests.get(subscribe_url)
            if response.status_code == 200:
                return Response({"status": "Subscription confirmed"}, status=status.HTTP_200_OK)
            else:
                return Response({"status": "Failed to confirm subscription"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Handle other message types (e.g., Notification)
        elif message_type == 'Notification':
            # Process the SNS notification here
            # message['Message'] contains the actual message sent by SNS
            message_data = json.loads(full_message['Message'])
            print(message_data['Records'][0]['eventName'])
            print(message_data['Records'][0]['s3']['object']['key'])
            return Response({"status": "Notification received"}, status=status.HTTP_200_OK)

        return Response({"status": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
