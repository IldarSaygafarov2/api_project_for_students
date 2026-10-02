from django.contrib import admin

from .models import QuestionAnswer, ContactFormMessage


@admin.register(ContactFormMessage)
class ContactFormMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    list_display_links = ['name']
    list_filter = ['created_at']


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'created_at']
    list_display_links = ['question']
    list_filter = ['created_at']
