import { NextFunction, Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface PayloadInterface {
  id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  mobile: string;
  image: string | null;
}

export interface SessionInterface extends Request {
  session?: PayloadInterface;
}

export const AuthMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    // console.log("accessToken", accessToken);

    if (!accessToken) throw TryError("Failed to  verify authorised user", 401);

    const payload = (await jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    )) as JwtPayload;

    req.session = {
      id: payload.id,
      email: payload.email,
      mobile: payload.mobile,
      fullname: payload.fullname,
      image: payload.image,
    };

    next();
  } catch (err) {
    CatchError(err, res, "Failed to verify authorised user");
  }
};
