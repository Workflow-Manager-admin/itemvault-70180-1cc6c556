from django.urls import path
from .views import (
    health,
    RegisterView,
    login_view,
    logout_view,
    ItemListCreateView,
    ItemRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('health/', health, name='Health'),

    # Auth endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # Item CRUD endpoints
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),
]
