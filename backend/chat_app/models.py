from django.db import models

# Create your models here.

# models.py
from django.db import models
import uuid


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender_id = models.CharField(max_length=36)
    receiver_id = models.CharField(max_length=36)
    message = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender_id} to {self.receiver_id} at {self.timestamp}"
