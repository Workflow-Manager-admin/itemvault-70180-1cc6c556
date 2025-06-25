from django.urls import path
from .views import (
    health,
    ItemListCreateView,
    ItemRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('health/', health, name='Health'),
    # Item CRUD endpoints
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),
]
