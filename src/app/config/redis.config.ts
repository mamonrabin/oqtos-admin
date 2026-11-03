import { createClient } from "redis";
import config from "../config/index.js";

const redisClient = createClient({
  ...(config.redis_user ? { username: config.redis_user } : {}),
  ...(config.redis_password ? { password: config.redis_password } : {}),

  socket: {
    ...(config.redis_host ? { host: config.redis_host } : {}),
    port: Number(config.redis_port || 6379),
    connectTimeout: 10000,

    reconnectStrategy: (retries) => {
      return Math.min(retries * 500, 3000);
    },
  },
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
  connectionPromise = null;
});

let connectionPromise: Promise<void> | null = null;

function waitForRedisReady(timeoutMs = 15000): Promise<void> {
  if (redisClient.isReady) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeout);
      redisClient.off("ready", onReady);
      redisClient.off("end", onEnd);
    };

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onEnd = () => {
      cleanup();
      reject(new Error("Redis connection closed before becoming ready"));
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Redis connection timed out"));
    }, timeoutMs);

    redisClient.once("ready", onReady);
    redisClient.once("end", onEnd);

    // Check again after registering listeners to avoid a missed ready event.
    if (redisClient.isReady) {
      onReady();
    }
  });
}

export async function connectRedis(): Promise<void> {
  if (redisClient.isReady) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    } else {
      // Already connecting or reconnecting. Do not call connect() again.
      await waitForRedisReady();
    }

    if (!redisClient.isReady) {
      throw new Error("Redis connection is not ready");
    }

    console.log("Redis connected successfully");
  })();

  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error("Redis connection failed:", error);
    throw error;
  }
}

export { redisClient };