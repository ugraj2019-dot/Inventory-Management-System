import express from "express";
import cors from "cors";
import { loggers } from "./middlewares/loggers.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import "./models/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(loggers);
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Inventory Management API is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is reachable" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
