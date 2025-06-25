from rest_framework.test import APITestCase
from django.urls import reverse


class HealthTests(APITestCase):
    def test_health(self):
        url = reverse('Health')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Server is up!"})


class ItemCRUDTests(APITestCase):
    def test_item_crud_public(self):
        # No items at start
        url = reverse('item-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

        # Create item (no auth required)
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
        new_data = {"title": "Changed", "content": "X"}
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
