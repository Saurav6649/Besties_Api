import express from "express";
import {
  addFriends,
  deleteFriends,
  fetchFriends,
  friendRequests,
  suggestedFriends,
  updateFriendStatus,
} from "../controllers/friend.controller";

const friendRouter = express.Router();

friendRouter.post("/", addFriends);
friendRouter.put("/:id", updateFriendStatus);
friendRouter.get("/", fetchFriends);
friendRouter.get("/suggested", suggestedFriends);
friendRouter.get("/request", friendRequests);
friendRouter.delete("/:id", deleteFriends);

export default friendRouter;
