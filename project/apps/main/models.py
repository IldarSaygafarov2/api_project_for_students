from django.db import models

from project.apps.common.models import BaseModel


class QuestionAnswer(BaseModel):
    question = models.CharField(
        verbose_name='Вопрос', max_length=100, unique=True)
    answer = models.TextField(verbose_name='Ответ')

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = 'Вопрос-ответ'
        verbose_name_plural = 'Вопросы-Ответы'
        ordering = ['-created_at']


class ContactFormMessage(BaseModel):
    name = models.CharField(verbose_name='Имя', max_length=50)
    email = models.EmailField(verbose_name='Почта')
    message = models.TextField(verbose_name='Сообщение')

    def __str__(self):
        return f'{self.name}: {self.email}'

    class Meta:
        verbose_name = 'Сообщение контактной формы'
        verbose_name_plural = 'Сообщения контактной формы'
