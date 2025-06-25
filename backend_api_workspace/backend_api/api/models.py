from django.db import models
from django.contrib.auth.models import User


class Item(models.Model):
    """
    PUBLIC_INTERFACE
    Item model representing an individual managed item.
    """
    title = models.CharField(max_length=255, help_text="Title of the item")
    content = models.TextField(help_text="Details/content of the item")
    created = models.DateTimeField(auto_now_add=True, help_text="Time the item was created")
    updated = models.DateTimeField(auto_now=True, help_text="Time the item was last updated")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='items',
        help_text="Owning user"
    )

    def __str__(self):
        return self.title
