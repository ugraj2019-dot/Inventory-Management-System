import app from "./app.js";
import { config } from "./config/index.js";
import { sequelize } from "./config/database.js";
import { User } from "./models/userModels.js";
import bcrypt from "bcrypt";

async function ensureDefaultAdmin() {
  const username = "admin";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  let admin = await User.findOne({ where: { username } });

  if (!admin) {
    admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      username,
      passwordHash,
    });
    console.log("Default admin account created: admin / admin123");
  } else {
    // Keep the supplied demo credentials valid every time the backend starts.
    admin.firstName = "Admin";
    admin.lastName = "User";
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log("Default admin account ready: admin / admin123");
  }
}

async function startServer() {
  try {
    // Creates the SQLite database/tables if needed and updates the schema.
    await sequelize.sync({ alter: true });
    await ensureDefaultAdmin();

    app.listen(config.port, () => {
      console.log(`server running on ${config.port}`);
      console.log("Login: admin / admin123");
    });
  } catch (error) {
    console.error("Failed to start the inventory server:", error);
    process.exit(1);
  }
}

startServer();
