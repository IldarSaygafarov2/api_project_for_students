from dj_rest_auth.serializers import LoginSerializer
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number']


class UserLoginSerializer(LoginSerializer):
    username = None

    # def validate(self, attrs):
    #     print(attrs)



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['role', 'username', 'phone_number', 'region', 'email', 'password']

