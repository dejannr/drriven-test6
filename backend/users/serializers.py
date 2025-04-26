from django.contrib.auth import get_user_model
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='details.image', read_only=True)
    cover_image = serializers.ImageField(source='details.cover_image', read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'image', 'cover_image',
        )

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = (*UserCreateSerializer.Meta.fields, 'first_name', 'last_name')