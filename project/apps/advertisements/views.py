from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, pagination
from rest_framework.filters import SearchFilter
from . import serializers
from .filters import AdvertisementListFilter
from .models import Category, Advertisement


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class AdvertisementListView(generics.ListAPIView):
    queryset = Advertisement.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = AdvertisementListFilter
    search_fields = ['name']
    serializer_class = serializers.AdvertisementListSerializer
    pagination_class = pagination.LimitOffsetPagination



class AdvertisementDetailView(generics.RetrieveAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = serializers.AdvertisementDetailSerializer
    lookup_field = 'slug'
