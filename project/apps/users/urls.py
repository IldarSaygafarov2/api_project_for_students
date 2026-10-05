from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='login-user'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='refresh-user'),
    path('auth/google/', views.GoogleLoginView.as_view(), name='google-login'),
    path('auth/google/callback/', views.GoogleLoginCallback.as_view(), name='google-login-callback'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-registration')

]
