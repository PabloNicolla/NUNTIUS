from dj_rest_auth.serializers import LoginSerializer
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    device_id = serializers.CharField(required=True)

    def validate(self, attrs):
        # Extract the device_id from the request data
        device_id = attrs.get('device_id')

        # Call the original validate method to validate the refresh token
        data = super().validate(attrs)

        # Extract the original refresh token
        refresh_token = attrs['refresh']

        # Decode the original refresh token to check the device_id
        from rest_framework_simplejwt.tokens import RefreshToken
        token = RefreshToken(refresh_token)

        if token.get('device_id') != device_id:
            raise serializers.ValidationError('Invalid device ID')

        # Add device_id to the response data
        data['device_id'] = device_id

        return data


class CustomLoginSerializer(LoginSerializer):
    device_id = serializers.CharField(required=True)

    def validate(self, attrs):
        # Call the original validate method to authenticate the user
        super().validate(attrs)

        # Add the device_id to the validated data
        attrs['device_id'] = self.initial_data.get('device_id')

        return attrs
