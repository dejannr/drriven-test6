import base64
from rest_framework import serializers
from .models import BlogPost, BlogPostCategory

class BlogPostSerializer(serializers.ModelSerializer):
    cover_photo = serializers.SerializerMethodField()  # New field for the cover photo

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'content',
            'published',
            'created_at',
            'updated_at',
            'cover_photo',
            'short_description'  # New short description field
        ]

    def get_cover_photo(self, obj):
        # Check if the blog post has a cover photo and encode it to base64
        if obj.cover_photo:
            return base64.b64encode(obj.cover_photo).decode('utf-8')
        return None


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