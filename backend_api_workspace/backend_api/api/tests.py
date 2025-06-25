from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Item
from rest_framework.authtoken.models import Token


class HealthTests(APITestCase):
    def test_health(self):
        url = reverse('Health')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Server is up!"})


class AuthTests(APITestCase):
    def test_register_login_logout(self):
        # Register
        url = reverse('register')
        data = {"username": "testuser", "password": "secretpass123", "email": "a@b.com"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "testuser")

        # Login
        url = reverse('login')
        data = {"username": "testuser", "password": "secretpass123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        token = response.data["token"]

        # Invalid login
        response = self.client.post(url, {"username": "testuser", "password": "wrong"})
        self.assertEqual(response.status_code, 401)

        # Logout requires authentication
        url = reverse('logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)


class ItemCRUDTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", password="secret123")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_item_crud(self):
        # No items at start
        url = reverse('item-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

        # Create item
        post_data = {"title": "First", "content": "Content1"}
        response = self.client.post(url, post_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "First")
        item_id = response.data["id"]

        # List items (should have 1)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        # Retrieve item
        detail_url = reverse('item-detail', kwargs={"pk": item_id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "First")

        # Update item
        new_data = {"title": "Changed", "content": "X", "user": response.data["user"]}
        response = self.client.put(detail_url, new_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Changed")

        # Delete item
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)

        # Now 0 items
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_permissions(self):
        # Should require auth (for both list and create)
        self.client.credentials()  # Remove auth
        url = reverse('item-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, {"title": "X", "content": "Y"})
        self.assertEqual(response.status_code, 401)

        # Item detail operations require auth
        item = Item.objects.create(user=self.user, title="A", content="B")
        detail_url = reverse('item-detail', kwargs={"pk": item.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 401)
        response = self.client.put(detail_url, {"title": "X", "content": "Y", "user": self.user.pk})
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 401)
