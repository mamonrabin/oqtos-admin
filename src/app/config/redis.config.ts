
import { createClient } from "redis";
import config from "../config/index.js";

const redisClient = createClient({
  ...(config.redis_user ? { username: config.redis_user } : {}),
  ...(config.redis_password ? { password: config.redis_password } : {}),

  socket: {
    ...(config.redis_host ? { host: config.redis_host } : {}),
    port: Number(config.redis_port || 6379),

    // Enable only when your Redis provider requires TLS.
    ...(process.env.REDIS_TLS === "true" ? { tls: true as const } : {}),

    connectTimeout: 10000,

    reconnectStrategy: (retries) => {
      // Stop retrying after 10 attempts.
      if (retries > 10) {
        console.error("Redis: Maximum reconnection attempts reached");
        return new Error("Redis reconnection limit reached");
      }

      return Math.min(retries * 500, 3000);
    },
  },
});

let connectionPromise: Promise<void> | null = null;

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("reconnecting", () => {
  console.warn("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
  connectionPromise = null;
});

function waitForRedisReady(timeoutMs = 15000): Promise<void> {
  if (redisClient.isReady) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      redisClient.off("ready", onReady);
      redisClient.off("end", onEnd);
    };

    const finish = (error?: Error) => {
      if (settled) return;

      settled = true;
      cleanup();

      if (error) reject(error);
      else resolve();
    };

    const onReady = () => finish();
    const onEnd = () =>
      finish(new Error("Redis connection closed before becoming ready"));

    const timeout = setTimeout(() => {
      finish(new Error("Redis connection timed out"));
    }, timeoutMs);

    redisClient.once("ready", onReady);
    redisClient.once("end", onEnd);

    // Avoid missing a ready event.
    if (redisClient.isReady) {
      finish();
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
