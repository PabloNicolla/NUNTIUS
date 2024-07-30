from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from dj_rest_auth.utils import jwt_encode
from dj_rest_auth.models import get_token_model
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from .serializers import CustomLoginSerializer, CustomTokenRefreshSerializer, CustomRegisterSerializer
from user_app.models import CustomUser


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

    def login(self):
        self.user = self.serializer.validated_data['user']
        self.user.device_id = self.serializer.validated_data['device_id']
        token_model = get_token_model()

        if api_settings.USE_JWT:
            self.access_token, self.refresh_token = jwt_encode(self.user)
        elif token_model:
            self.token = api_settings.TOKEN_CREATOR(
                token_model, self.user, self.serializer)

        if api_settings.SESSION_LOGIN:
            self.process_login()

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        self.serializer.is_valid(raise_exception=True)
        self.serializer.save()

        self.login()
        return self.get_response()


class CustomTokenRefreshView(APIView):
    # permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenRefreshSerializer
    token_class = RefreshToken

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user']['id']
        old_refresh_token = serializer.validated_data['refresh']

        # Blacklist the old refresh token
        try:
            old_refresh_token.blacklist()
        except AttributeError:
            pass

        # Generate a new refresh token and access token
        user = CustomUser.objects.get(id=user_id)
        access_token, refresh_token = jwt_encode(user)

        response_data = {
            'refresh': str(refresh_token),
            'access': str(access_token),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = self.get_response_data(user)
        # data['user']['device_id'] = serializer.validated_data.get('device_id')

        if data:
            response = Response(
                data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            response = Response(
                status=status.HTTP_204_NO_CONTENT, headers=headers)

        return response
