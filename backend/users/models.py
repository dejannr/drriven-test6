from django.db import models
from django.contrib.auth.models import User

class UserDetails(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='details'
    )
    image = models.BinaryField(null=True, blank=True)
    cover_image = models.BinaryField(null=True, blank=True)

    def __str__(self):
        return f"Details for {self.user.username}"
