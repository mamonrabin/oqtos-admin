
import mongoose from "mongoose";
import config from "./index.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!config.database_url) {
    throw new Error("DATABASE_URL is missing");
  }

  connectionPromise = mongoose
    .connect(config.database_url, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
      return mongoose;
    })
    .catch((error) => {
      connectionPromise = null;
      console.error("MongoDB connection failed:", error);
      throw error;
    });

  return connectionPromise;
};
