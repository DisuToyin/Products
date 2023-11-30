// external packages
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
// import morgan from "morgan";

// internal files
import router from "./routes";

import { connectDB } from "./config/db";

const app = express();

connectDB();

app.use(
  cors({
    credentials: true,
  })
);

app.use(cookieParser());
// app.use(morgan());
app.use(bodyParser.json());

app.listen(8080, () => {
  console.log("Server Running!");
});

app.use("/api/v1", router());

export default app;
