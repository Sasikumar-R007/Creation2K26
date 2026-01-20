// Vercel serverless function entry point
// Note: For Express.js apps, Render is recommended over Vercel
// This file provides basic Vercel support but may need adjustments
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "http";
import express, { type Express } from "express";
import { registerRoutes } from "../server/routes";

let app: Express | null = null;
let httpServer: ReturnType<typeof createServer> | null = null;

async function getApp(): Promise<Express> {
  if (app) return app;

  app = express();
  httpServer = createServer(app);

  declare module "http" {
    interface IncomingMessage {
      rawBody: unknown;
    }
  }

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  await registerRoutes(httpServer!, app);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  
  // Convert Vercel request/response to Express format
  return new Promise<void>((resolve) => {
    expressApp(req as any, res as any, () => {
      if (!res.headersSent) {
        res.status(404).json({ message: "Not found" });
      }
      resolve();
    });
  });
}

