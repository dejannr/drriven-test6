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
    image = serializers.SerializerMethodField()  # New field for the image

    class Meta:
        model = BlogPostCategory
        fields = ['id', 'name', 'image']

    def get_image(self, obj):
        # Check if the category has an image and encode it to base64
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')
        return None