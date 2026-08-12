import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  },
  reorderLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: { min: 0 },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  },
  supplier: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "products",
  timestamps: true,
  indexes: [
    { name: "products_sku_user_id_unique", unique: true, fields: ["sku", "userId"] },
    { name: "products_name_user_id_unique", unique: true, fields: ["name", "userId"] },
  ],
});
