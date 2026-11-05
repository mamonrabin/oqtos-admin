
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
import { connectDB } from "./app/config/db.config.js";
import "./app/config/passport.js";

const app: Application = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust Vercel's reverse proxy
app.set("trust proxy", 1);

// CORS
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://demosite-flame-eta.vercel.app",
//    "https://oqtosadmin.vercel.app",
// ];

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
// );


const allowedOrigins = [
  "http://localhost:3000",
  "https://demosite-flame-eta.vercel.app",
  "https://oqtosadmin.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
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

// Health check (does not require MongoDB)
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Oqtos API is running",
  });
});

// Static uploads
app.use(
  "/api/v1/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

// Connect MongoDB before database-dependent middleware and routes
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection middleware failed:", error);
    next(error);
  }
});

// Session configuration
const sessionSecret = process.env.EXPRESS_SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("EXPRESS_SESSION_SECRET is missing from environment variables");
}

app.use(
  expressSession({
    name: "oqtos.sid",
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

// API routes
app.use("/api/v1", router);

// 404 and global error handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
