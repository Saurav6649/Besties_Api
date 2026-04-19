import { Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import * as fs from "fs";

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

const createOrder = async (req: Request, res: Response) => {
  try {
    const amount = req.body?.amount;

    console.log("amount", amount);

    if (!amount) TryError("Amount is required", 400);

    const payload = {
      amount: amount * 100,
      currency: process.env.CURRENCY!,
      receipt: `rep_${Date.now()}`,
    };

    const order = await razorpay.orders.create(payload);  // this is the main line create the order
    res.json(order);
  } catch (err) {
    CatchError(err, res, "Failed to create a order");
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("🔥 Webhook hit");

    const signature = req.headers["x-razorpay-signature"] as string; // creat a address

    if (!signature) {
      console.log("❌ No signature");
      return res.status(400).send("Invalid request");
    }

    const payload = JSON.stringify(body);
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_SECRET!)
      .update(payload) // 👈 RAW body
      .digest("hex");

    if (signature !== generatedSignature) { // if signature and generatedSignature same then payment will completed
      console.log("❌ Signature mismatch");
      throw TryError("Invalid signature", 400);
    }

    console.log("✅ Signature verified");

    // convert buffer to JSON
    // const body = JSON.parse(req.body.toString());

    fs.writeFileSync("payment.json", JSON.stringify(body, null, 2));

    if (
      body.event === "payment.authorized" &&
      process.env.NODE_ENV === "development"
    )
      console.log("Payment success for dev servers");

    if (
      body.event === "payment.captured" &&
      process.env.NODE_ENV === "production"
    )
      console.log("Payment success for production servers");

    if (body.event === "payment.failed") console.log("Payment Failed");

    res.json({ message: "Payment Success" });
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).send("Webhook error");
  }
};

export default createOrder;
