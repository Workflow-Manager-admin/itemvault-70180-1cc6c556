from django.contrib import admin
from .models import Item


# PUBLIC_INTERFACE
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    """Admin interface for Item model."""
    list_display = ("id", "title", "created", "updated")
    search_fields = ("title", "content")
    readonly_fields = ("created", "updated")
