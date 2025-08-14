import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());
app.use("/api", routes);

// Global error handler
app.use(errorHandler);

export default app;
