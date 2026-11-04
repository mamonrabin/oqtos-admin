import type { Server } from "node:http";

import config from "./app/config/index.js";
import app from "./app.js";
import { connectDB } from "./app/config/db.config.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";

let server: Server | undefined;
let isShuttingDown = false;

async function main(): Promise<void> {
  try {
    await connectDB();

    await seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`Oqtos API running on port ${config.port}`);
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

async function cleanup(): Promise<void> {
  try {
    const mongoose = await import("mongoose");

    if (mongoose.default.connection.readyState !== 0) {
      await mongoose.default.disconnect();
    }
  } catch (error) {
    console.error("MongoDB cleanup failed:", error);
  }
}

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
    process.exitCode = 0;
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exitCode = 1;
  }
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  void shutdown("Unhandled rejection");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  void shutdown("Uncaught exception");
});

void main();