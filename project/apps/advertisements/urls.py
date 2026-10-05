from django.urls import path

from . import views


urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='categories-list'),
    path('advertisements/', views.AdvertisementListView.as_view(),
         name='advertisements-list'),
    path('advertisements/<slug:slug>/',
         views.AdvertisementDetailView.as_view(), name='advertisement-detail')
]
