import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { createChat, fetchChat } from "../controllers/chat.controllers";

const ChatRouter = express.Router();

ChatRouter.get("/:to", AuthMiddleware, fetchChat);

export default ChatRouter;
