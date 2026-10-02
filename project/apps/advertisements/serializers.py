from .models import Category, Subcategory


from rest_framework import serializers


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'slug', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True)
    total_subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at',
                  'total_subcategories', 'subcategories']

    def get_total_subcategories(self, instance):
        return instance.subcategories.count()
