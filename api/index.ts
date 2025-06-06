import express from "express";
import { createServerlessExpress } from "@codegenie/vercel-express";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { registerRoutes } from "../routes"; // adjust path if needed

const app = express();
app.use(express.json());

if (process.env.DATABASE_URL) {
  try {
    const sql = postgres(process.env.DATABASE_URL);
    const db = drizzle(sql);
    app.locals.db = db;
    console.log("Database connected.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

registerRoutes(app);

export default createServerlessExpress(app);
