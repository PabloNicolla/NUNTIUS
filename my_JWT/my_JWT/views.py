from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status


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


class CustomRegisterView(RegisterView):
    # def get_response_data(self, user):
    #     data = super().get_response_data(user)
    #     refresh = RefreshToken.for_user(user)
    #     access_token = str(refresh.access_token)
    #     # Prepare response data
    #     response_data = {
    #         'user': data,
    #         'access_token': access_token,
    #         'refresh_token': str(refresh)
    #     }
    #     return response_data
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            # Extract response data
            response_data = response.data

            # Set cookies
            # response.set_cookie(
            #     settings.REST_AUTH['JWT_AUTH_COOKIE'],
            #     response_data['access'],
            #     httponly=settings.REST_AUTH['JWT_AUTH_HTTPONLY'],
            #     samesite=settings.REST_AUTH['JWT_AUTH_SAMESITE']
            # )
            # response.set_cookie(
            #     settings.REST_AUTH['JWT_AUTH_REFRESH_COOKIE'],
            #     response_data['refresh'],
            #     httponly=settings.REST_AUTH['JWT_AUTH_HTTPONLY'],
            #     samesite=settings.REST_AUTH['JWT_AUTH_SAMESITE']
            # )
        return response
