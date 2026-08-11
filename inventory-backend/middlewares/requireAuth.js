import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.userId;
    req.fullName = payload.fullName;
    req.role = payload.role || "staff";
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.role !== "admin") {
    return res.status(403).json({ error: "Administrator permission required" });
  }
  next();
}
