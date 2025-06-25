from django.contrib import admin
from .models import Item


# PUBLIC_INTERFACE
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    """Admin interface for Item model."""
    list_display = ("id", "title", "user", "created", "updated")
    search_fields = ("title", "content", "user__username")
    readonly_fields = ("created", "updated")
