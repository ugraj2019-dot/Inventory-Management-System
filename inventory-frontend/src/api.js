const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_DEV || "http://localhost:3000/api")
  : (import.meta.env.VITE_API_BASE_PROD || "http://localhost:3000/api");

export default API_BASE_URL;

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.details?.map((item) => item.message).join(", ");
    throw new Error(detail || data.error || data.message || `Request failed (${response.status})`);
  }
  return data;
}
