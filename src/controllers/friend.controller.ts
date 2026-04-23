import { Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";
import { SessionInterface } from "../middleware/auth.middleware";
import FriendModel from "../models/friends.model";
import AuthModal from "../models/auth.model";
import mongoose from "mongoose";

export const addFriends = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const friend = await FriendModel.create(req.body);
    res.json({ message: "Friend Request Sent " });
  } catch (err) {
    CatchError(err, res, "Failed to send friend request");
  }
};

export const fetchFriends = async (req: SessionInterface, res: Response) => {
  try {
    const userId = req.session?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const friends = await FriendModel.find({
      $or: [{ user: userId }, { friend: userId }],
      status: "accepted", // 🔥 only accepted friends
    })
      .populate("friend")
      .populate("user")
      .lean();

    const seen = new Set();

    const modified = friends
      .map((item: any) => {
        const isUser = item.user._id.toString() === userId;
        const friend = isUser ? item.friend : item.user;

        // 🔥 duplicate remove
        if (seen.has(friend._id.toString())) return null;
        seen.add(friend._id.toString());

        return {
          _id: item._id,
          friend,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
      .filter(Boolean);

    res.json(modified);
  } catch (err) {
    CatchError(err, res, "Failed to fetch friends");
  }
};

export const deleteFriends = async (req: SessionInterface, res: Response) => {
  try {
    const friend = await FriendModel.deleteOne({ _id: req.params.id });

    if (!friend) throw TryError("Invalid Friend Details");

    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    CatchError(err, res, "Failed to delete friends");
  }
};

export const suggestedFriends = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    if (!req.session) throw TryError("Failed to suggest friends", 401);

    const friend = await AuthModal.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(req.session.id) },
        },
      },
      { $sample: { size: 5 } },
      { $project: { fullname: 1, image: 1, createdAt: 1 } },
    ]);

    const modified = await Promise.all(
      friend.map(async (item) => {
        const count = await FriendModel.countDocuments({ friend: item._id });
        return count === 0 ? item : null;
      }),
    );

    const filtered = modified.filter((item) => item !== null);

    res.json(filtered);
  } catch (err) {
    CatchError(err, res, "Failed to Suggested friends");
  }
};

export const friendRequests = async (req: SessionInterface, res: Response) => {
  try {
    if (!req.session) throw TryError("Failed to suggest friends", 401);

    const friend = await FriendModel.find({
      friend: req.session.id,
      status: "requested",
    }).populate("user", "image fullname");
    res.json(friend);
  } catch (err) {
    CatchError(err, res, "Failed to fetch friend Request");
  }
};

export const updateFriendStatus = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    if (!req.session) throw TryError("Failed to update friends status", 401);

    if (!req.body.status) throw TryError("Invalid status", 401);

    await FriendModel.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
    );
    res.json({ message: "Friend Status Updated" });
  } catch (err) {
    CatchError(err, res, "Failed to fetch friend Request");
  }
};
