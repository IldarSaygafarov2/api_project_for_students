from django.shortcuts import render
from .serializers import CategorySerializer

from rest_framework import generics
from .models import Category


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
