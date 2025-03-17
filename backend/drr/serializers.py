import base64

from rest_framework import serializers
from .models import BlogPost, BlogPostCategory

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'published',
            'created_at',
            'updated_at'
        ]

class BlogPostCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostCategory
        fields = ['id', 'name', 'icon']