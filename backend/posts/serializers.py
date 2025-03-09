from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'name', 'description', 'likes_count', 'is_liked']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        # The current request is available in context
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
