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
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = BlogPostCategory
        fields = ['id', 'name', 'image']


class BlogPostSerializer(serializers.ModelSerializer):
    cover_photo = serializers.SerializerMethodField()
    creator     = UserSerializer(read_only=True)
    categories  = BlogPostCategorySerializer(many=True, read_only=True)

    class Meta:
        model  = BlogPost
        fields = [
            'id', 'title', 'slug', 'content',
            'published', 'created_at', 'updated_at',
            'cover_photo', 'short_description',
            'creator', 'categories',
        ]

    def get_cover_photo(self, obj):
        """
        Returns the public URL of the cover_photo stored in DO Spaces.
        If you pass `request` into your serializer context, this will
        return an absolute URL; otherwise a relative one.
        """
        if not obj.cover_photo:
            return None

        url = obj.cover_photo.url  # e.g. "/media/cover_photos/2025/04/17/foo.jpg"
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return url