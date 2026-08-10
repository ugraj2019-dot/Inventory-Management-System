import bcrypt from "bcrypt";
import { User } from "./models/userModels.js";
import { sequelize } from "./config/database.js";

try {
  await sequelize.sync({ alter: true });

  const passwordHash = await bcrypt.hash("admin123", 10);
  const [admin, created] = await User.findOrCreate({
    where: { username: "admin" },
    defaults: {
      firstName: "Admin",
      lastName: "User",
      passwordHash,
    },
  });

  if (!created) {
    admin.firstName = "Admin";
    admin.lastName = "User";
    admin.passwordHash = passwordHash;
    await admin.save();
  }

  console.log("Default admin is ready.");
  console.log("Username: admin");
  console.log("Password: admin123");
} catch (error) {
  console.error("Could not create the default admin account:", error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
