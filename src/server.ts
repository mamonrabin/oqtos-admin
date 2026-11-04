
import type { Server } from "node:http";
import mongoose from "mongoose";

import config from "./app/config/index.js";
import app from "./app.js";

import {
  redisClient,
} from "./app/config/redis.config.js";

import { ensureServicesConnected } from "./app/bootstrap.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";

let server: Server | undefined;
let isShuttingDown = false;

async function main(): Promise<void> {
  try {
    // Validate configuration
    if (!config.database_url) {
      throw new Error("DATABASE_URL is missing");
    }

    // Connect MongoDB and Redis
    await ensureServicesConnected();

    // Seed Super Admin only during local server startup.
    await seedSuperAdmin();

    // Start local Express server
    server = app.listen(config.port, () => {
      console.log(
        `Oqtos API running at http://localhost:${config.port}`,
      );
    });

    server.on("error", (error) => {
      console.error("HTTP Server Error:", error);
      void shutdown("Server error");
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    await cleanup();

    process.exitCode = 1;
  }
}

// Cleanup connections
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

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await cleanup();

    console.log("Oqtos server shut down successfully");

    process.exitCode = 0;
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exitCode = 1;
  }
}

// Handle termination signals locally
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

// Start server
void main();
