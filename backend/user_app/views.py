from rest_framework.throttling import AnonRateThrottle
from .models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class CheckEmailView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return Response({"message": "Email is already in use.", "code": "IN_USE"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Email is available.", "code": "AVAILABLE"}, status=status.HTTP_200_OK)


class ContactView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.filter(username=username).first()
            if user:
                return Response({
                    "id": user.id,
                    "username": user.username,
                    "imageURL": user.imageURL,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No user found with this username"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error occurred while fetching user: {e}")
            return Response({"message": "An error occurred while processing your request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
