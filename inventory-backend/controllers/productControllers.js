import { ProductService } from "../services/productService.js";

export async function getProducts(req, res) {
  res.json(await ProductService.getAllProducts(req.userId, req.query.search || ""));
}
export async function getProductByID(req, res) {
  const product = await ProductService.getProductById(req.params.id, req.userId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}
export async function createProduct(req, res) {
  const product = await ProductService.createProduct(req.body, req.userId);
  res.status(201).json(product);
}
export async function updateProduct(req, res) {
  const updated = await ProductService.updateProduct(req.params.id, req.body, req.userId);
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
}
export async function deleteProduct(req, res) {
  const deleted = await ProductService.deleteProduct(req.params.id, req.userId);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted", product: deleted });
}
export async function getInventorySummary(req, res) {
  res.json(await ProductService.getSummary(req.userId));
}
