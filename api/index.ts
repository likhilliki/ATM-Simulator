import express, { Request, Response } from "express";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes"; // adjust as needed

const app = express();
app.use(express.json());

registerRoutes(app); // mount your routes

export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any);
};
