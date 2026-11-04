
import mongoose from "mongoose";


import {
  connectRedis,
  redisClient,
} from "./config/redis.config.js";
import config from "./config/index.js";

let connectionPromise: Promise<void> | null = null;

export async function ensureServicesConnected(): Promise<void> {
  // Reuse healthy connections.
  if (
    mongoose.connection.readyState === 1 &&
    redisClient.isReady
  ) {
    return;
  }

  // Reuse an ongoing connection attempt.
  if (!connectionPromise) {
    connectionPromise = (async () => {
      if (!config.database_url) {
        throw new Error("DATABASE_URL is missing");
      }

      // MongoDB
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(config.database_url);
        console.log("MongoDB connected");
      }

      // Redis
      if (!redisClient.isReady) {
        if (!redisClient.isOpen) {
          await connectRedis();
        }
      }

      if (!redisClient.isReady) {
        throw new Error("Redis connection is not ready");
      }

      console.log("Redis connected");
    })();
  }

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }

  // Check again on subsequent requests so dropped connections
  // can be re-established.
  connectionPromise = null;
}
