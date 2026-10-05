from urllib.parse import urljoin

import requests
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.urls import reverse
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from project.apps.users.serializers import UserRegistrationSerializer


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client


class GoogleLoginCallback(APIView):
    def get(self, request, *args, **kwargs):
        code = request.GET.get("code")
        if code is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        token_endpoint_url = urljoin("http://localhost:8000", reverse("google_login"))
        response = requests.post(url=token_endpoint_url, data={"code": code})

        return Response(response.json(), status=status.HTTP_200_OK)



class UserRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

