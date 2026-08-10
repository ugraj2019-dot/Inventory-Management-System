import { apiRequest } from "../api";

export const getProducts = (token, search = "") =>
  apiRequest(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`, { token });

export const getProductById = (id, token) =>
  apiRequest(`/products/${id}`, { token });

export const createProduct = (data, token) =>
  apiRequest("/products", { method: "POST", body: data, token });

export const updateProduct = (id, data, token) =>
  apiRequest(`/products/${id}`, { method: "PUT", body: data, token });

export const deleteProduct = (id, token) =>
  apiRequest(`/products/${id}`, { method: "DELETE", token });

export const getInventorySummary = (token) =>
  apiRequest("/products/summary", { token });
