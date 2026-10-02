from django.contrib import admin

from . import models


class SubcategoryAdminInline(admin.TabularInline):
    model = models.Subcategory
    extra = 1
    prepopulated_fields = {'slug': ('name',)}


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    list_display_links = ['name']
    list_filter = ['created_at']
    search_fields = ['name']
    inlines = [SubcategoryAdminInline]


@admin.register(models.Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category', 'created_at']
    list_display_links = ['name']
    list_filter = ['category', 'created_at']
    list_editable = ['category']


class AdvertisementImageInline(admin.TabularInline):
    model = models.AdvertisementImage
    extra = 1


class AdvertisementCharacteristicInline(admin.TabularInline):
    model = models.AdvertisementCharacteristic
    extra = 1


@admin.register(models.Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price',
                    'category', 'subcategory', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    list_display_links = ['name']
    list_filter = ['category', 'user', 'created_at']
    list_editable = ['category', 'subcategory']
    search_fields = ['name', 'description']
    inlines = [AdvertisementImageInline, AdvertisementCharacteristicInline]
