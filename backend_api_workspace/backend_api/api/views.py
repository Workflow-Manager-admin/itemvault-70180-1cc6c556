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

# For improved documentation
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    method="get",
    operation_summary="Health Check",
    operation_description="Returns server status with a simple up message.",
    responses={200: openapi.Response("Server is up!")},
    tags=["Health"],
)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health(request):
    try:
        return Response({"message": "Server is up!"})
    except Exception as e:
        return Response(
            {"detail": f"Internal server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# PUBLIC_INTERFACE
class RegisterView(generics.CreateAPIView):
    """
    POST /api/register/
    Registers a new user.

    Request Body:
    - username: str
    - email: str (optional)
    - password: str

    Response 201: User object.

    Permissions: Public (no authentication required)
    """
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Register New User",
        operation_description=(
            "Registers a new user account. Password must be at least 8 characters."
        ),
        tags=["Authentication"],
        request_body=UserRegisterSerializer,
        responses={
            201: openapi.Response("Created", UserSerializer),
            400: "Validation Error"
        },
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to register user: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# PUBLIC_INTERFACE
@swagger_auto_schema(
    method="post",
    operation_summary="Login",
    operation_description="Authenticates a user. Returns a token and user info.",
    tags=["Authentication"],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["username", "password"],
        properties={
            "username": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Username"
            ),
            "password": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Password"
            ),
        },
    ),
    responses={
        200: openapi.Response("Token and User Data"),
        401: "Invalid credentials",
    },
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    POST /api/login/
    Authenticates user. Expects username and password.

    Returns token and user object on success.
    """
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(
            {"detail": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "user": UserSerializer(user).data}
            )
        else:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        return Response(
            {"detail": f"Login failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# PUBLIC_INTERFACE
@swagger_auto_schema(
    method="post",
    operation_summary="Logout",
    operation_description="Logs out the authenticated user. Requires authentication (token header).",
    tags=["Authentication"],
    responses={
        200: "Logged out successfully.",
        401: "Not authenticated"
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    POST /api/logout/
    Logs out the current user.

    Requires authentication (token in header).
    """
    try:
        logout(request)
        return Response({"detail": "Logged out successfully."})
    except Exception as e:
        return Response(
            {"detail": f"Logout failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# PUBLIC_INTERFACE
class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET: List all items belonging to the authenticated user.
    POST: Create a new item.

    Authentication: Required (Token)
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get Items",
        operation_description="List all items belonging to the authenticated user.",
        tags=["Items"],
        responses={200: ItemSerializer(many=True)},
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to retrieve items: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_summary="Create Item",
        operation_description="Create a new item for the authenticated user.",
        tags=["Items"],
        request_body=ItemSerializer,
        responses={201: ItemSerializer, 400: "Validation Error"}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to create item: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user).order_by("-created")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# PUBLIC_INTERFACE
class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single item.

    Only the owner may access their items. Authentication required.
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Retrieve Item",
        operation_description=(
            "Retrieve details for a single item "
            "(must be owned by the authenticated user)."
        ),
        tags=["Items"],
        responses={
            200: ItemSerializer,
            404: "Not found"
        },
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to retrieve item: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND
            )

    @swagger_auto_schema(
        operation_summary="Update Item",
        operation_description=(
            "Update an existing item (must be owned by the authenticated user)."
        ),
        tags=["Items"],
        request_body=ItemSerializer,
        responses={200: ItemSerializer, 400: "Validation error"}
    )
    def put(self, request, *args, **kwargs):
        try:
            return super().put(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to update item: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        operation_summary="Delete Item",
        operation_description=(
            "Delete an existing item (must be owned by the authenticated user)."
        ),
        tags=["Items"],
        responses={204: "No content / Deleted", 404: "Not found"}
    )
    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Unable to delete item: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND
            )

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)
