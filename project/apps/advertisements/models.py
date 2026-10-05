from django.db import models

from project.apps.common.models import BaseModel
from project.apps.common.choices import RegionChoices


class BaseCategoryModel(BaseModel):
    name = models.CharField(verbose_name='Название',
                            max_length=50, unique=True)
    slug = models.SlugField(verbose_name='Слаг', unique=True, max_length=60)

    class Meta:
        abstract = True


class Category(BaseCategoryModel):
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Subcategory(BaseCategoryModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                 related_name='subcategories', verbose_name='Категория')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Подкатегория'
        verbose_name_plural = 'Подкатегории'


class Advertisement(BaseModel):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Активно'
        MODERATION = 'moderation', 'На модерации'
        ARCHIVED = 'archived', 'Архивированно'

    name = models.CharField(verbose_name='Название',
                            max_length=100)
    slug = models.SlugField(verbose_name='Слаг', max_length=120, unique=True)
    preview = models.ImageField(
        verbose_name='Заставка', upload_to='advertisements/previews/', null=True, blank=True)
    price = models.PositiveIntegerField(verbose_name='Цена', default=0)
    address = models.CharField(verbose_name='Адрес')
    views = models.PositiveIntegerField(default=0, verbose_name='Просмотры')
    description = models.TextField(verbose_name='Описание')
    status = models.CharField(
        verbose_name='Статус', choices=Status.choices, default=Status.MODERATION)
    region = models.CharField(verbose_name='Регион', max_length=30,
                              choices=RegionChoices.choices, default=RegionChoices.TASHKENT_CITY)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE,
                             related_name='advertisements', verbose_name='Пользователь')
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                 related_name='advertisements', verbose_name='Категория')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, related_name='advertisements',
                                    verbose_name='Подкатегория')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Объявление'
        verbose_name_plural = 'Объявления'


class AdvertisementImage(BaseModel):
    advertisement = models.ForeignKey(
        Advertisement, on_delete=models.CASCADE, related_name='images', verbose_name='Объявление')
    image = models.ImageField(
        verbose_name='Фото', upload_to='advertisements/photos/%Y/%m/%d/')

    def __str__(self):
        return f'Фото для ({self.advertisement.name})'

    class Meta:
        verbose_name = 'Фото объявления'
        verbose_name_plural = 'Фото объявлений'


class AdvertisementCharacteristic(BaseModel):
    advertisement = models.ForeignKey(
        Advertisement, on_delete=models.CASCADE, related_name='characteristics', verbose_name='Объявление')
    key = models.CharField(verbose_name='Название', max_length=50)
    value = models.CharField(verbose_name='Значение', max_length=70)

    def __str__(self):
        return f'{self.key}: {self.value}'

    class Meta:
        verbose_name = 'Характеристика объявления'
        verbose_name_plural = 'Характеристики объявления'
