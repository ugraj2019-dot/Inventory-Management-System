import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";

export async function listUsers(req, res) {
  const users = await User.findAll({
    attributes: ["id", "firstName", "lastName", "username", "role", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  res.json(users);
}

export async function updateUserRole(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const role = req.body.role;
  if (!["admin", "staff"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or staff" });
  }

  if (user.id === req.userId && role !== "admin") {
    return res.status(400).json({ error: "You cannot remove your own admin role" });
  }

  user.role = role;
  await user.save();

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    role: user.role,
  });
}

export async function deleteUser(req, res) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.id === req.userId) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }

  await user.destroy();
  res.json({ message: "User deleted" });
}
