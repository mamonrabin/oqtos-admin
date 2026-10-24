import cookieParser from 'cookie-parser';
import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import passport from 'passport';
import expressSession from 'express-session';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';
// import config from './app/config/index.js';
import { router } from './app/routes/index.js';
import './app/config/passport.js';
import path from 'path';
const app: Application = express();

app.use(
  expressSession({
    secret: 'ecommerce_secret_key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
// after live link start
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
// after live link end
// app.use(
//   cors({
//     origin: config.frontend_url,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(
  "/api/v1/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the ecommerce  server site!',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
