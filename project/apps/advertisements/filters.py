import django_filters

from .models import Advertisement, Category, Subcategory


class AdvertisementListFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    subcategory = django_filters.ModelChoiceFilter(queryset=Subcategory.objects.all())

    class Meta:
        model = Advertisement
        fields = ['min_price', 'max_price', 'category', 'subcategory']
