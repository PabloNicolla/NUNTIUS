from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from .serializers import CustomLoginSerializer, CustomTokenRefreshSerializer

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, serializers

from django.views.decorators.csrf import csrf_exempt


class PublicView(APIView):
    permission_classes = (AllowAny,)

    @csrf_exempt
    def get(self, request):
        return Response({"message": "This is a public endpoint"})


class PrivateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({"message": "This is a private endpoint"})


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def get_response(self):
        serializer_class = self.get_response_serializer()
        serializer = serializer_class(instance=self.token)
        data = serializer.data

        refresh = RefreshToken.for_user(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        response = Response(data, status=status.HTTP_200_OK)
        return response


class CustomLoginView(LoginView):
    def get_serializer_class(self):
        return CustomLoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = self.request.user
            device_id = request.data.get('device_id')

            # Generate tokens and include the device_id in the payload
            refresh = RefreshToken.for_user(user)
            # Add device ID to the token payload
            refresh['device_id'] = device_id

            # Update the response with the new tokens
            response.data['refresh'] = str(refresh)
            response.data['access'] = str(refresh.access_token)

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def get_serializer_class(self):
        return CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError:
            return Response({"detail": "Invalid device ID"}, status=status.HTTP_401_UNAUTHORIZED)

        data = serializer.validated_data

        return Response(data, status=status.HTTP_200_OK)
