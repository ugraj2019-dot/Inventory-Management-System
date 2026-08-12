import { Op } from "sequelize";
import { Product } from "../models/productModels.js";

const fields = ["name", "sku", "category", "quantity", "reorderLevel", "unitPrice", "supplier"];

const scope = (role, userId) => role === "admin" ? {} : { userId };

const duplicateError = (field) => {
  const error = new Error(`A product with this ${field} already exists`);
  error.status = 409;
  return error;
};

async function ensureUniqueProduct({ name, sku, userId, excludeId }) {
  const exclusion = excludeId ? { id: { [Op.ne]: excludeId } } : {};

  const duplicateName = await Product.findOne({
    where: { name, userId, ...exclusion },
  });
  if (duplicateName) throw duplicateError("name");

  const duplicateSku = await Product.findOne({
    where: { sku, userId, ...exclusion },
  });
  if (duplicateSku) throw duplicateError("SKU");
}

export const ProductService = {
  getAllProducts: async (userId, role, search = "") => {
    const where = scope(role, userId);
    if (search.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { sku: { [Op.like]: `%${search.trim()}%` } },
        { category: { [Op.like]: `%${search.trim()}%` } },
      ];
    }
    return Product.findAll({ where, order: [["createdAt", "DESC"]] });
  },

  getProductById: async (id, userId, role) => {
    return Product.findOne({ where: { id, ...scope(role, userId) } });
  },

  createProduct: async (data, userId) => {
    await ensureUniqueProduct({ name: data.name, sku: data.sku, userId });
    return Product.create({
      ...Object.fromEntries(fields.filter((field) => data[field] !== undefined).map((field) => [field, data[field]])),
      userId,
    });
  },

  updateProduct: async (id, data, userId, role) => {
    const product = await Product.findOne({ where: { id, ...scope(role, userId) } });
    if (!product) return null;
    const name = data.name ?? product.name;
    const sku = data.sku ?? product.sku;
    if (name !== product.name || sku !== product.sku) {
      await ensureUniqueProduct({
        name,
        sku,
        userId: product.userId,
        excludeId: product.id,
      });
    }
    fields.forEach((field) => {
      if (data[field] !== undefined) product[field] = data[field];
    });
    await product.save();
    return product;
  },

  deleteProduct: async (id, userId, role) => {
    const product = await Product.findOne({ where: { id, ...scope(role, userId) } });
    if (!product) return null;
    await product.destroy();
    return product;
  },

  getSummary: async (userId, role) => {
    const products = await Product.findAll({ where: scope(role, userId) });
    return {
      totalProducts: products.length,
      totalUnits: products.reduce((sum, p) => sum + Number(p.quantity), 0),
      inventoryValue: products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.unitPrice), 0),
      lowStock: products.filter((p) => Number(p.quantity) <= Number(p.reorderLevel)).length,
    };
  },
};
