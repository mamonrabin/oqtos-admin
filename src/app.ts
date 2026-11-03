
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

const app: Application = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust Vercel's reverse proxy
app.set("trust proxy", 1);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://demosite-flame-eta.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as server-to-server calls.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
const sessionSecret = process.env.EXPRESS_SESSION_SECRET;

if (isProduction && !sessionSecret) {
  throw new Error("EXPRESS_SESSION_SECRET is missing from environment variables");
}

// Make sure Redis is connected before requests use the session store.
const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "oqtos:session:",
});

app.use(
  expressSession({
    name: "oqtos.sid",
    store: sessionStore,
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static uploads
// Note: Vercel's filesystem is not persistent for uploaded files.
app.use(
  "/api/v1/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Oqtos API is running",
  });
});

// API routes
app.use("/api/v1", router);

// Handle unmatched routes before the global error handler
app.use(notFound);
app.use(globalErrorHandler);

export default app;
