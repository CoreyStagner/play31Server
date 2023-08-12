import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import gamesRouter from "./routes/games";
import usersRouter from "./routes/users";
import defaultRouter from "./routes/default";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

// Set up Express Server
const app = express();
// Set up Logger
app.use(morgan("dev"));
// Use JSON Payloads
app.use(express.json());
// Set up Session
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING,
  }),
}));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/games",  gamesRouter);
app.use("/", defaultRouter);

// Default Catch All
app.use((req, res, next) => {
  console.log(req.path)
  // console.log(res)
  next(createHttpError(404, `Endpoint not found`));
});

// Error Handler
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "Something went wrong";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
  }
);

export default app;
