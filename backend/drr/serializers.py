import base64
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogPost, BlogPostCategory

# Assuming the user model is the AUTH_USER_MODEL
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'image']

    def get_image(self, obj):
        # Check if the user has associated details and an image exists.
        if hasattr(obj, 'details') and obj.details.image:
            return base64.b64encode(obj.details.image).decode('utf-8')
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


class BlogPostSerializer(serializers.ModelSerializer):
    cover_photo = serializers.SerializerMethodField()  # New field for the cover photo
    creator = UserSerializer(read_only=True)  # Nested user serializer
    categories = BlogPostCategorySerializer(many=True, read_only=True)  # New field to include categories

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
            'short_description',
            'creator',
            'categories'  # Added categories to the fields list
        ]

    def get_cover_photo(self, obj):
        # Check if the blog post has a cover photo and encode it to base64
        if obj.cover_photo:
            return base64.b64encode(obj.cover_photo).decode('utf-8')
        return None