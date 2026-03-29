import express from "express";
import {
  addFriends,
  fetchFriends,
  suggestedFriends,
} from "../controllers/friend.controller";

const friendRouter = express.Router();

friendRouter.post("/", addFriends);
friendRouter.get("/", fetchFriends);
friendRouter.get("/suggested", suggestedFriends);

export default friendRouter;
