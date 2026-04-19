import express from "express";
import createOrder, { webhook } from "../controllers/payment.controllers";

const PaymentRouter = express.Router();

PaymentRouter.post("/order", createOrder);
// PaymentRouter.post("/webhook", webhook);

export default PaymentRouter;
