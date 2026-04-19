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
import corsConfig from "./utils/corsConfig";
import { createServer } from "http";
import { Server } from "socket.io";
import StatusSocket from "./socket/StatusSocket";
import ChatSocket from "./socket/chat.socket";
import ChatRouter from "./routers/chat.router";
import VideoSocket from "./socket/video.socket";
import TwilioRouter from "./routers/twilio.router";
import PaymentRouter from "./routers/payment.router";
import { webhook } from "./controllers/payment.controllers";
import PostRouter from "./routers/post.router";

const app = express();
const server = createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`server is runing on port ${process.env.PORT}`);
});

const io = new Server(server, { cors: corsConfig });
StatusSocket(io);
ChatSocket(io);
VideoSocket(io);

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: process.env.DOMAIN,
//     credentials: true,
//   }),
// );
app.use(cookieParser());
app.use("/chat", ChatRouter);
app.use("/api-doc", serve, setup(SwaggerConfig));
app.use("/auth", Authrouter);
app.use("/storage", AuthMiddleware, storageRouter);
app.use("/friend", AuthMiddleware, friendRouter);
app.use("/twilio", AuthMiddleware, TwilioRouter);
app.use("/post", AuthMiddleware, PostRouter);
app.use("/payment", AuthMiddleware, PaymentRouter);

// webhook route
app.post("/payment/webhook", webhook);
