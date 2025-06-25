import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vscode-internal-1872-beta.beta01.cloud.kavia.ai:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// PUBLIC_INTERFACE
export async function fetchItems() {
  return api.get('/api/items/');
}

// PUBLIC_INTERFACE
export async function createItem(data: { title: string; description: string }) {
  return api.post('/api/items/', data);
}

// PUBLIC_INTERFACE
export async function updateItem(id: number, data: { title: string; description: string }) {
  return api.put(`/api/items/${id}/`, data);
}

// PUBLIC_INTERFACE
export async function deleteItem(id: number) {
  return api.delete(`/api/items/${id}/`);
}
