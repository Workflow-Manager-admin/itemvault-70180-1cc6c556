from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from .models import Item
from .serializers import (
    ItemSerializer,
    UserSerializer,
    UserRegisterSerializer,
)
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def health(request):
    return Response({"message": "Server is up!"})


# PUBLIC_INTERFACE
class RegisterView(generics.CreateAPIView):
    """
    POST /api/register/
    Registers a new user.
    """
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


# PUBLIC_INTERFACE
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    POST /api/login/
    Authenticates user. Expects username and password.
    """
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})
    else:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# PUBLIC_INTERFACE
@api_view(['POST'])
def logout_view(request):
    """
    POST /api/logout/
    Logs out the current user.
    """
    logout(request)
    return Response({"detail": "Logged out successfully."})


# PUBLIC_INTERFACE
class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET: List all items belonging to the authenticated user.
    POST: Create a new item.
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user).order_by("-created")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# PUBLIC_INTERFACE
class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single item.
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)
