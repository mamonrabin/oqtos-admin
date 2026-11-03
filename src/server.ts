
import mongoose from "mongoose";
import type { Server } from "node:http";

import config from "./app/config/index.js";
import app from "./app.js";
import {
  connectRedis,
  redisClient,
} from "./app/config/redis.config.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";

let server: Server | undefined;
let isShuttingDown = false;

async function main(): Promise<void> {
  try {
    if (!config.database_url) {
      throw new Error("DATABASE_URL is missing");
    }

    // 1. Connect MongoDB
    await mongoose.connect(config.database_url);
    console.log("MongoDB connected");

    // 2. Connect Redis before Express handles requests
    await connectRedis();
    console.log("Redis connected");

    // 3. Seed Super Admin
    await seedSuperAdmin();

    // 4. Start Express server
    server = app.listen(config.port, () => {
      console.log(`Oqtos API running on port ${config.port}`);
    });

    server.on("error", (error) => {
      console.error("HTTP Server Error:", error);
      void shutdown("server error");
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    await cleanup();

    process.exitCode = 1;
  }
}

// Close database connections during local shutdown only.
async function cleanup(): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  if (redisClient.isOpen) {
    tasks.push(redisClient.quit());
  }

  if (mongoose.connection.readyState !== 0) {
    tasks.push(mongoose.disconnect());
  }

  const results = await Promise.allSettled(tasks);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Cleanup failed:", result.reason);
    }
  }
}

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    // Stop accepting new HTTP requests.
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    // Close Redis and MongoDB after HTTP server closes.
    await cleanup();

    console.log("Server shut down successfully");

    process.exitCode = 0;
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exitCode = 1;
  }
}

// Handle termination signals.
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

// Handle unexpected errors.
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  void shutdown("Unhandled rejection");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdown("Uncaught exception");
});

// Start application.
void main();
