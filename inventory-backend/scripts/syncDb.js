import { sequelize } from "../config/database.js";
import "../models/index.js";

try {
  await sequelize.sync({ alter: true });
  console.log("Inventory database synced successfully");
  process.exit(0);
} catch (err) {
  console.error("Failed to sync database:", err);
  process.exit(1);
}
