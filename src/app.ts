
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

const app: Application = express();

// Trust Vercel proxy
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://demosite-flame-eta.vercel.app",
    ],
    credentials: true,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static uploads
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

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
