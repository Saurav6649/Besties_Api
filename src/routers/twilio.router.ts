import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import getTurnServer from "../controllers/twilio.controllers";

const TwilioRouter = express.Router();

TwilioRouter.get("/turn-server", AuthMiddleware, getTurnServer);

export default TwilioRouter;
