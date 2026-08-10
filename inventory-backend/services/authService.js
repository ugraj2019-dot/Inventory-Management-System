// services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}
function issueToken(user) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const token = jwt.sign(
    { userId: user.id, fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  return { token, id: user.id, username: user.username, fullName };
}
export const AuthService = {
  register: async ({ firstName, lastName, username, password }) => {
    if (!firstName || !lastName || !username || !password) {
      throw new AuthError(
        "First name, last name, username, and password are required",
        400,
      );
    }
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      throw new AuthError("Username already taken", 409);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      passwordHash,
    });
    return issueToken(user);
  },
  login: async ({ username, password }) => {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new AuthError("Invalid username or password", 401);
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AuthError("Invalid username or password", 401);
    }
    return issueToken(user);
  },
};
