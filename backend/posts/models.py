from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return self.name
