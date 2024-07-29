from dj_rest_auth.registration.views import SocialLoginView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

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
