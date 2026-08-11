import { Op } from "sequelize";
import { Product } from "../models/productModels.js";

const fields = ["name", "sku", "category", "quantity", "reorderLevel", "unitPrice", "supplier"];

const scope = (role, userId) => role === "admin" ? {} : { userId };

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
    const duplicate = await Product.findOne({ where: { sku: data.sku, userId } });
    if (duplicate) {
      const error = new Error("A product with this SKU already exists");
      error.status = 409;
      throw error;
    }
    return Product.create({
      ...Object.fromEntries(fields.filter((field) => data[field] !== undefined).map((field) => [field, data[field]])),
      userId,
    });
  },

  updateProduct: async (id, data, userId, role) => {
    const product = await Product.findOne({ where: { id, ...scope(role, userId) } });
    if (!product) return null;
    if (data.sku && data.sku !== product.sku) {
      const duplicate = await Product.findOne({
        where: { sku: data.sku, userId: product.userId, id: { [Op.ne]: id } }
      });
      if (duplicate) {
        const error = new Error("A product with this SKU already exists");
        error.status = 409;
        throw error;
      }
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
