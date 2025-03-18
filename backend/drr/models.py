from django.db import models
from django.utils.text import slugify

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    cover_photo = models.BinaryField(null=True, blank=True)  # New cover photo field
    short_description = models.TextField(blank=True)  # New short description field
    content = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Auto-generate slug from title if not provided
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
