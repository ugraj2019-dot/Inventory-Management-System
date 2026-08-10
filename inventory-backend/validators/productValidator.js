import { param, body } from "express-validator";

const nonNegativeInt = (field, label) =>
  body(field).optional().isInt({ min: 0 }).withMessage(`${label} must be a non-negative integer`).toInt();

export const createProductValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("sku").trim().notEmpty().withMessage("SKU is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer").toInt(),
  body("reorderLevel").isInt({ min: 0 }).withMessage("Reorder level must be a non-negative integer").toInt(),
  body("unitPrice").isFloat({ min: 0 }).withMessage("Unit price must be non-negative").toFloat(),
  body("supplier").optional({ nullable: true }).trim(),
];

export const updateProductValidator = [
  param("id").isInt().withMessage("id must be an integer").toInt(),
  body("name").optional().trim().notEmpty().withMessage("Product name must not be empty"),
  body("sku").optional().trim().notEmpty().withMessage("SKU must not be empty"),
  body("category").optional().trim().notEmpty().withMessage("Category must not be empty"),
  nonNegativeInt("quantity", "Quantity"),
  nonNegativeInt("reorderLevel", "Reorder level"),
  body("unitPrice").optional().isFloat({ min: 0 }).withMessage("Unit price must be non-negative").toFloat(),
  body("supplier").optional({ nullable: true }).trim(),
];

export const idParamValidator = [
  param("id").isInt().withMessage("id must be an integer").toInt(),
];
