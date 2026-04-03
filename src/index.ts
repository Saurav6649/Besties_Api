import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./config/db";
connectDb();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Authrouter from "./routers/auth.router";
import storageRouter from "./routers/storage.router";
import { AuthMiddleware } from "./middleware/auth.middleware";
import friendRouter from "./routers/friend.router";
import { serve, setup } from "swagger-ui-express";
import SwaggerConfig from "./utils/swagger";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api-doc", serve, setup(SwaggerConfig));
app.use("/auth", Authrouter);
app.use("/storage", AuthMiddleware, storageRouter);
app.use("/friend", AuthMiddleware, friendRouter);

app.listen(process.env.PORT, () => {
  console.log(`server is runing on port ${process.env.PORT}`);
});
