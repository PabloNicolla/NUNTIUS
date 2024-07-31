from rest_framework import serializers
from .models import CustomUser
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError


class ProfileImageSerializer(serializers.Serializer):
    imageURL = serializers.CharField(
        required=False,  # Make the field optional
        allow_blank=True,  # Allow empty strings
        validators=[URLValidator()]  # Use URLValidator for URL validation
    )

    def validate_imageURL(self, value):
        if value:
            try:
                URLValidator()(value)
            except ValidationError:
                raise serializers.ValidationError("Invalid URL format.")
        return value


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'imageURL',
                  'device_id', 'first_name', 'last_name', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance
