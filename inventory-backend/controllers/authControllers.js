// controllers/authControllers.js
import { AuthService, AuthError } from "../services/authService.js";
export async function register(req, res) {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function login(req, res) {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function logout(req, res) {
  // There's no server-side session to destroy — the JWT is stateless, and
  // "logging out" just means the client stops sending it. This route
  // exists so the frontend has something consistent to call.
  res.status(200).json({ message: "Logged out" });
}
