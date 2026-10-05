from . import models
from project.apps.users.serializers import UserSerializer

from rest_framework import serializers


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subcategory
        fields = ['id', 'name', 'slug', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True)
    total_subcategories = serializers.SerializerMethodField()

    class Meta:
        model = models.Category
        fields = ['id', 'name', 'slug', 'created_at',
                  'total_subcategories', 'subcategories']

    def get_total_subcategories(self, instance):
        return instance.subcategories.count()


class AdvertisementImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AdvertisementImage
        fields = ['id', 'image', 'created_at']


class AdvertisementCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AdvertisementCharacteristic
        fields = ['id', 'key', 'value', 'created_at']


class AdvertisementListSerializer(serializers.ModelSerializer):
    region = serializers.SerializerMethodField()

    class Meta:
        model = models.Advertisement
        fields = ['id', 'name', 'slug', 'preview',
                  'price', 'region', 'created_at']

    def get_region(self, instance):
        return instance.get_region_display()


class AdvertisementDetailSerializer(serializers.ModelSerializer):
    images = AdvertisementImageSerializer(many=True)
    characteristics = AdvertisementCharacteristicSerializer(many=True)
    user = UserSerializer(many=False)

    class Meta:
        model = models.Advertisement
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'created_at', 'user',
            'images', 'characteristics'
        ]
