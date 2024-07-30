from django.contrib.auth.models import AbstractUser
import uuid
from django.db import models


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    imageURL = models.CharField(blank=True, max_length=500)
    device_ids = models.JSONField(default=list)
