from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer


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
class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET: List all items.
    POST: Create a new item.

    Authentication: Not required.
    Permissions: Public; anyone can see and create items.
    """
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]  # All operations are now public

    @swagger_auto_schema(
        operation_summary="Get Items",
        operation_description="List all items. No authentication required.",
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
        operation_description="Create a new item (public).",
        tags=["Items"],
        request_body=ItemSerializer,
        responses={201: ItemSerializer, 400: "Validation Error"},
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
        return Item.objects.all().order_by("-created")


# PUBLIC_INTERFACE
class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single item.

    Item operations are public (no authentication required).
    """
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]  # Public access

    @swagger_auto_schema(
        operation_summary="Retrieve Item",
        operation_description="Retrieve details for a single item. Public.",
        tags=["Items"],
        responses={
            200: ItemSerializer,
            404: "Not found",
        },
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Item.DoesNotExist:
            return Response(
                {"detail": "Not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": f"Unable to retrieve item: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND
            )

    @swagger_auto_schema(
        operation_summary="Update Item",
        operation_description="Update an existing item. Public.",
        tags=["Items"],
        request_body=ItemSerializer,
        responses={
            200: ItemSerializer,
            400: "Validation error",
        },
    )
    def put(self, request, *args, **kwargs):
        try:
            return super().put(request, *args, **kwargs)
        except Item.DoesNotExist:
            return Response(
                {"detail": "Not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": f"Unable to update item: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        operation_summary="Delete Item",
        operation_description="Delete an existing item. Public.",
        tags=["Items"],
        responses={
            204: "No content / Deleted",
            404: "Not found",
        },
    )
    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except Item.DoesNotExist:
            return Response(
                {"detail": "Not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": f"Unable to delete item: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND
            )

    def get_queryset(self):
        return Item.objects.all()
