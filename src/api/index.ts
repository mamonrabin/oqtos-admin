import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import config from "../app/config/index.js";
import { connectRedis } from "../app/config/redis.config.js";
import { seedSuperAdmin } from "../app/utils/seedSuperAdmin.js";
import app from "../app.js";



let initializationPromise: Promise<void> | null = null;

async function initializeServer(): Promise<void> {
  // MongoDB
  if (mongoose.connection.readyState === 0) {
    if (!config.database_url) {
      throw new Error("DATABASE_URL is missing");
    }

    await mongoose.connect(config.database_url);
    console.log("MongoDB connected");
  } else if (mongoose.connection.readyState === 2) {
    // Wait for an existing connection attempt.
    await mongoose.connection.asPromise();
  } else if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not in a usable connection state");
  }

  // Redis
  await connectRedis();

  // Seed Super Admin
  await seedSuperAdmin();

  console.log("Vercel server initialization completed");
}

async function ensureInitialized(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeServer().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  await initializationPromise;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    await ensureInitialized();

    app(
      req as unknown as Request,
      res as unknown as Response,
    );
  } catch (error) {
    console.error("Vercel API initialization failed:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}