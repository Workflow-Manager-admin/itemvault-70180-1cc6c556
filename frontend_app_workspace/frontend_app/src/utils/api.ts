import axios from 'axios';
import Cookies from 'js-cookie';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vscode-internal-1872-beta.beta01.cloud.kavia.ai:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// PUBLIC_INTERFACE
export function setAuthToken(token: string | null) {
  if (token) {
    Cookies.set('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    Cookies.remove('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  return Cookies.get('auth_token');
}

// Setup token from cookie on load
const token = getAuthToken();
if (token) setAuthToken(token);

// PUBLIC_INTERFACE
export async function register(username: string, password: string) {
  // Adjust endpoint/fields to match backend
  return api.post('/api/register/', { username, password });
}

// PUBLIC_INTERFACE
export async function login(username: string, password: string) {
  // Adjust endpoint/fields to match backend
  return api.post('/api/login/', { username, password });
}

// PUBLIC_INTERFACE
export async function logout() {
  return api.post('/api/logout/');
}

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
