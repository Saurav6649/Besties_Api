import { Request, Response } from "express";
import AuthModal from "../models/auth.model";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcrypt";
import { CatchError, TryError } from "../utils/error";
import { v4 as uuid } from "uuid";
import {
  PayloadInterface,
  SessionInterface,
} from "../middleware/auth.middleware";


const accessTokenExpiry = "10m";
type TokenType = "at" | "rt";
const TenMinInMs = 10 * 60 * 1000;
const SevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

const generateToken = (payload: PayloadInterface) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: accessTokenExpiry,
  });
  const refreshToken = uuid();
  return {
    accessToken,
    refreshToken,
  };
};

const getOptions = (tokenType: TokenType) => {
  return {
    httpOnly: true,
    maxAge: tokenType === "at" ? TenMinInMs : SevenDaysInMs,
    secure: false,
    domain: "localhost",
  };
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    await AuthModal.create(req.body);
    res.json({ message: "Signup Success" });
  } catch (err: unknown) {
    CatchError(err, res);
    // return res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await AuthModal.findOne({ email });

    if (!user)
      throw TryError("Invalid username or password please try again", 404);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw TryError("Invalid username or password please try again", 401);

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      image: user.image ?? null 
    };

    const { accessToken, refreshToken } = generateToken(payload);

    await AuthModal.updateOne(
      { _id: user._id },
      { $set: { refreshToken, expiry: moment().add(7, "days").toDate() } },
    );

    // console.log(accessToken);

    res.cookie("accessToken", accessToken, getOptions("at"));
    res.cookie("refreshToken", refreshToken, getOptions("rt"));

    res.status(200).json({
      message: "Login success",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    CatchError(err, res, "Login failed please try after sometime");
    // return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const option = {
      httpOnly: true,
      maxAge: 0,
      domain: "localhost",
    };

    res.clearCookie("accessToken", option);
    res.clearCookie("refreshToken", option);
    res.json({
      message: "Logout Successfully",
    });
  } catch (err) {
    CatchError(err, res, "Invalid Cookies");
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw TryError("Session Expired Please login first", 401);

    const decode = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as PayloadInterface;

    res.json(decode);
  } catch (err: unknown) {
    CatchError(err, res, "Invalid User");
  }
};

export const refresh_token = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Failed to refresh token", 401);

    // console.log("session", req.session);

    const { accessToken, refreshToken } = generateToken(req.session);

    await AuthModal.updateOne(
      { _id: req.session.id },
      {
        $set: {
          refreshToken,
          expiry: moment().add(7, "days").toDate(),
        },
      },
    );

    res.cookie("accessToken", accessToken, getOptions("at"));
    res.cookie("refreshToken", refreshToken, getOptions("rt"));
    res.json({ message: "Token refreshed" });
  } catch (err) {
    CatchError(err, res, "Failed to refresh token");
  }
};

export const profilePicture = async (req: SessionInterface, res: Response) => {
  try {
    // const path = req.body.path;
     const path = `${process.env.S3_URL}/${req.body.path}`

    if (!path || !req.session)
      throw TryError("Invalid request path is required", 400);

    console.log("path", path);

    await AuthModal.updateOne(
      { _id: req.session.id },
      { $set: { image: path } },
    );

    res.json({ image: path });
  } catch (err: unknown) {
    CatchError(err, res, "Invalid User");
  }
};

