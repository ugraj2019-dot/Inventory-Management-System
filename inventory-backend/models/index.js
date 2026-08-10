import { Product } from "./productModels.js";
import { User } from "./userModels.js";

User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

export { Product, User };
