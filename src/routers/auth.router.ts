import express from "express";
import {
  getSession,
  loginUser,
  logout,
  profilePicture,
  refresh_token,
  registerUser,
} from "../controllers/auth.controllers";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RefreshToken } from "../middleware/refresh.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/session", getSession);
router.get("/refreshToken", RefreshToken, refresh_token);
router.put("/profile-picture", AuthMiddleware, profilePicture);

export default router;
