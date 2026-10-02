from django.db import models


class RegionChoices(models.TextChoices):
    REPUBLIC_OF_KARAKALPAKSTAN = "republic_of_karakalpakstan", "Республика Каракалпакстан"
    ANDIJAN = "andijan", "Андижанская область"
    BUKHARA = "bukhara", "Бухарская область"
    FERGANA = "fergana", "Ферганская область"
    JIZZAKH = "jizzakh", "Джизакская область"
    KHOREZM = "khorezm", "Хорезмская область"
    NAMANGAN = "namangan", "Наманганская область"
    NAVOI = "navoi", "Навоийская область"
    KASHKADARYA = "kashkadarya", "Кашкадарьинская область"
    SAMARKAND = "samarkand", "Самаркандская область"
    SIRDARYA = "sirdarya", "Сырдарьинская область"
    SURKHANDARYA = "surkhandarya", "Сурхандарьинская область"
    TASHKENT_REGION = "tashkent_region", "Ташкентская область"
    TASHKENT_CITY = "tashkent_city", "Город Ташкент"
