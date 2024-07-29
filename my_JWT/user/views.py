from django.shortcuts import render

# Create your views here.

from rest_framework.throttling import AnonRateThrottle
from .models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response


from rest_framework import status
1


class CheckEmailView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return Response({"message": "Email is already in use.", "code": "IN_USE"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Email is available.", "code": "AVAILABLEE"}, status=status.HTTP_200_OK)
