from django.db import models
import uuid


class BaseModel(models.Model):
    id = models.UUIDField(editable=False, primary_key=True, default=uuid.uuid4)

    created_at = models.DateTimeField(
        verbose_name='Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField(
        verbose_name='Дата обновления', auto_now=True)

    class Meta:
        abstract = True
