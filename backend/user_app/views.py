from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import AnonRateThrottle
from .models import CustomUser
from .serializers import ProfileImageSerializer, ContactRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from uuid import UUID
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


class ProfileImageView(APIView):
    permission_classes = (IsAuthenticated,)
    throttle_classes = [AnonRateThrottle]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = ProfileImageSerializer(data={'imageURL': user.imageURL})
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = ProfileImageSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.imageURL = serializer.validated_data['imageURL']
            user.save()
            return Response({'message': 'Profile image updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = ContactRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        username = data.get('username')
        pk = data.get('pk')

        try:
            if pk:
                user = CustomUser.objects.filter(id=pk).first()
            else:
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
                return Response({"message": "No user found with the provided details"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error occurred while fetching user: {e}")
            return Response({"message": "An error occurred while processing your request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
