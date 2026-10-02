from django.db import models

from django.contrib.auth.models import AbstractUser
from project.apps.common.choices import RegionChoices
from .manager import CustomUserManager


class RoleChoices(models.TextChoices):
    SELLER = 'seller', 'Продавец'
    CUSTOMER = 'customer', 'Покупатель'


class User(AbstractUser):
    role = models.CharField(verbose_name='Роль', choices=RoleChoices.choices,
                            default=RoleChoices.CUSTOMER, max_length=15)
    phone_number = models.CharField(
        verbose_name='Номер телефона', max_length=15, unique=True)
    email = models.EmailField(verbose_name='Почта', unique=True)
    region = models.CharField(verbose_name='Регион', choices=RegionChoices.choices,
                              default=RegionChoices.TASHKENT_CITY, max_length=32)
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
