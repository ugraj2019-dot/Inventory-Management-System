import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "stockbase-development-secret-change-me",
  db: {
    storage: process.env.DB_STORAGE || "./database.sqlite",
  },
};
