from django.contrib.auth import get_user_model
from rest_framework import serializers
import base64

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'image', 'cover_image')

    def get_image(self, obj):
        # Check if the user has associated details and an image exists.
        if hasattr(obj, 'details') and obj.details.image:
            return base64.b64encode(obj.details.image).decode('utf-8')
        return None

    def get_cover_image(self, obj):
        # Check if the user has associated details and a cover image exists.
        if hasattr(obj, 'details') and obj.details.cover_image:
            return base64.b64encode(obj.details.cover_image).decode('utf-8')
        return None
