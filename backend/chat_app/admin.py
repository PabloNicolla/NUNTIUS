from django.contrib import admin
from .models import ChatMessage, ChatConfirmation


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender_id', 'receiver_id', 'timestamp')
    search_fields = ('sender_id', 'receiver_id')
    readonly_fields = ('id', 'timestamp')


@admin.register(ChatConfirmation)
class ChatConfirmationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender_id', 'receiver_id', 'timestamp')
    search_fields = ('sender_id', 'receiver_id')
    readonly_fields = ('id', 'timestamp')
