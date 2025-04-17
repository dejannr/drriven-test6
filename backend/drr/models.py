from django.conf import settings
from django.db import models
from django.utils.text import slugify

from myproject.storages import SpacesMediaStorage


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    # store the *path* in DB; the file lives in your Space
    cover_photo = models.ImageField(
        storage=SpacesMediaStorage(),
        upload_to='cover_photos/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text="Cover image stored in DigitalOcean Spaces"
    )

    short_description = models.TextField(blank=True)
    content = models.TextField()
    published = models.BooleanField(default=False)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts',
        null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class BlogPostCategory(models.Model):
    name = models.CharField(max_length=255)
    image = models.BinaryField(null=True, blank=True)  # Image field
    blog_posts = models.ManyToManyField('BlogPost', related_name='categories', blank=True)

    def __str__(self):
        return self.name
