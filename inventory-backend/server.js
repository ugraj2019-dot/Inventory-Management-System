import app from "./app.js";
import { config } from "./config/index.js";
import { sequelize } from "./config/database.js";
import { User } from "./models/userModels.js";
import bcrypt from "bcrypt";

async function ensureDefaultAdmin() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  let admin = await User.findOne({ where: { username: "admin" } });

  if (!admin) {
    await User.create({
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      passwordHash,
      role: "admin",
    });
    console.log("Default admin account created: admin / admin123");
  } else {
    admin.firstName = "Admin";
    admin.lastName = "User";
    admin.passwordHash = passwordHash;
    admin.role = "admin";
    await admin.save();
    console.log("Default admin account ready: admin / admin123");
  }
}

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    await ensureDefaultAdmin();

    app.listen(config.port, () => {
      console.log(`server running on ${config.port}`);
      console.log(`API: http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error("Failed to start the inventory server:", error);
    process.exit(1);
  }
}

startServer();
