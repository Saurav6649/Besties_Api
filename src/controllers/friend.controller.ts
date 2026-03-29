import { Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import { SessionInterface } from "../middleware/auth.middleware";
import FriendModel from "../models/friends.model";
import AuthModal from "../models/auth.model";

export const addFriends = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const friend = await FriendModel.create(req.body);
    res.json(friend);
  } catch (err) {
    CatchError(err, res, "Failed to send friend request");
  }
};

export const fetchFriends = async (req: SessionInterface, res: Response) => {
  try {
    const user = req.session?.id;
    const friends = await FriendModel.find({ user });
    res.json(friends);
  } catch (err) {
    CatchError(err, res, "Failed to fetch friends");
  }
};

export const suggestedFriends = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    const user = await AuthModal.aggregate([
      { $sample: { size: 5 } },
      { $project: { fullname: 1, image: 1 } },
    ]);
    res.json(user);
  } catch (err) {
    CatchError(err, res, "Failed to Suggested friends");
  }
};
