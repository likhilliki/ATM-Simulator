import express from "express";
import { registerRoutes } from "../routes"; // relative path adjusted
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createServerlessExpress } from "@codegenie/vercel-express"; // <- helpful wrapper for Vercel

const app = express();
app.use(express.json());

if (process.env.DATABASE_URL) {
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);
  app.locals.db = db;
}

await registerRoutes(app);

// ✅ No listen! Just export the handler
export default createServerlessExpress(app);
