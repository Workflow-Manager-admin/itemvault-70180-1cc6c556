from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Item


# PUBLIC_INTERFACE
class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration endpoint."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "password", "email")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", "")
        )
        return user


# PUBLIC_INTERFACE
class UserSerializer(serializers.ModelSerializer):
    """Basic User serialization (for read-only purposes)."""

    class Meta:
        model = User
        fields = ("id", "username", "email")


# PUBLIC_INTERFACE
class ItemSerializer(serializers.ModelSerializer):
    """Serializer for Item CRUD endpoints."""
    user = UserSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ["id", "title", "content", "created", "updated", "user"]
        read_only_fields = ["id", "created", "updated", "user"]
