from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/auth/registration/", include("dj_rest_auth.registration.urls")),

    path('api/v1/', include('project.apps.advertisements.urls')),
    path('api/v1/users/', include('project.apps.users.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='docs-schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='docs-schema'), name='docs-swagger'),
]




if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
