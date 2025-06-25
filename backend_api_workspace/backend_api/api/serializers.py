from rest_framework import serializers
from .models import Item


# PUBLIC_INTERFACE
class ItemSerializer(serializers.ModelSerializer):
    """Serializer for Item CRUD endpoints."""

    class Meta:
        model = Item
        fields = ["id", "title", "content", "created", "updated"]
        read_only_fields = ["id", "created", "updated"]
