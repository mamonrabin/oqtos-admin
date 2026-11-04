
import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import passport from "passport";
import expressSession from "express-session";
import path from "path";

import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
import notFound from "./app/middlewares/notFound.js";
import { router } from "./app/routes/index.js";
import "./app/config/passport.js";

import { RedisStore } from "connect-redis";
import { redisClient } from "./app/config/redis.config.js";
import { ensureServicesConnected } from "./app/bootstrap.js";

const app: Application = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust Vercel's reverse proxy.
app.set("trust proxy", 1);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://demosite-flame-eta.vercel.app",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check.
// This route verifies that the Express application is reachable.
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Oqtos API is running 🚀",
    environment: process.env.NODE_ENV,
  });
});

// Initialize MongoDB and Redis before using sessions or API routes.
app.use(async (_req, _res, next) => {
  try {
    await ensureServicesConnected();
    next();
  } catch (error) {
    next(error);
  }
});

// Session configuration
const sessionSecret = process.env.EXPRESS_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "EXPRESS_SESSION_SECRET is missing from environment variables",
  );
}

const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "oqtos:session:",
});

app.use(
  expressSession({
    name: "oqtos.sid",
    store: sessionStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Local static uploads only.
// Use Cloudinary for persistent production uploads.
if (!process.env.VERCEL) {
  app.use(
    "/api/v1/uploads",
    express.static(path.join(process.cwd(), "uploads")),
  );
}

// API routes
app.use("/api/v1", router);

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
