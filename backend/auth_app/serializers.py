from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.utils.translation import gettext_lazy as _
from user_app.serializers import CustomUserSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # token['device_id'] = user.device_id
        token['user'] = CustomUserSerializer(user).data
        return token


class CustomTokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    device_id = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs['refresh']
        device_id = attrs['device_id']

        try:
            token = RefreshToken(refresh)
        except Exception:
            raise serializers.ValidationError("Invalid refresh token")

        # Check if the device_id matches
        if token['user']['device_id'] != device_id:
            raise serializers.ValidationError("Device ID does not match")

        # Get the user
        user = token['user']

        attrs['user'] = user
        attrs['refresh'] = token
        return attrs


class CustomLoginSerializer(LoginSerializer):
    device_id = serializers.CharField(required=True)

    def save(self, **kwargs):
        # Perform the default validation
        data = super().validate(self.data)

        # Save the device_id to the user model
        user = data["user"]
        device_id = self.validated_data['device_id']
        user.device_id = device_id
        user.save(update_fields=['device_id'])

        return data


class CustomRegisterSerializer(RegisterSerializer):
    device_id = serializers.CharField(required=True)

    def save(self, request):  # this SER 6
        user = super().save(request)
        user.device_id = self.validated_data['device_id']
        user.save()
        return user
