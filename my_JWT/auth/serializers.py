# serializers.py
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.serializers import LoginSerializer as DefaultLoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from user.models import CustomUser
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


# class CustomRegisterSerializer(RegisterSerializer):
#     username = serializers.CharField()
#     email = serializers.EmailField(required=True)
#     password1 = serializers.CharField(write_only=True)
#     password2 = serializers.CharField(write_only=True)

#     def get_cleaned_data(self):
#         return {
#             'username': self.validated_data.get('username', ''),
#             'email': self.validated_data.get('email', ''),
#             'password1': self.validated_data.get('password1', ''),
#             'password2': self.validated_data.get('password2', ''),
#         }

#     def save(self, request):
#         user = super().save(request)
#         user.username = self.data.get('username')
#         user.save()

#         refresh = RefreshToken.for_user(user)

#         response = self.context.get('response')
#         response.set_cookie(
#             key='access_token',
#             value=str(refresh.access_token),
#             httponly=True,
#             samesite='Lax'
#         )
#         response.set_cookie(
#             key='refresh_token',
#             value=str(refresh),
#             httponly=True,
#             samesite='Lax'
#         )
#         return user


# class CustomLoginSerializer(DefaultLoginSerializer):
#     def get_token(self, user):
#         refresh = RefreshToken.for_user(user)
#         return {
#             'access': str(refresh.access_token),
#             'refresh': str(refresh),
#         }

#     def validate(self, attrs):
#         data = super().validate(attrs)
#         refresh = RefreshToken.for_user(self.user)

#         response = self.context.get('response')
#         response.set_cookie(
#             key='access_token',
#             value=str(refresh.access_token),
#             httponly=True,
#             samesite='Lax'
#         )
#         response.set_cookie(
#             key='refresh_token',
#             value=str(refresh),
#             httponly=True,
#             samesite='Lax'
#         )

#         data.update(self.get_token(self.user))
#         return data

# myapp/serializers.py


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "This email address is already in use.")
        return email

    def save(self, request):
        user = super().save(request)
        user.email = self.validated_data.get('email')
        user.save()
        return user
