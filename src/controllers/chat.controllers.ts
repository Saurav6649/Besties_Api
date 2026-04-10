import mongoose from "mongoose";
import ChatModel from "../models/chat.model";
import { SessionInterface } from "../middleware/auth.middleware";
import { CatchError } from "../utils/error";
import { Response } from "express";
import { downloadObject } from "../utils/S3";

interface PayloadInterface {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  message: string;
  file?: {
    path: string;
    type: string;
  };
}

export const createChat = (payload: PayloadInterface) => {
  ChatModel.create(payload).catch((err) => {
    console.log(err.message);
  });
};

export const fetchChat = async (req: SessionInterface, res: Response) => {
  try {
    const chat = await ChatModel.find({
      $or: [
        { from: req.session?.id, to: req.params.to },
        { from: req.params.to, to: req.session?.id },
      ],
    })
      .populate("from", "fullname email mobile image")
      .lean();

    const modifiedChats = await Promise.all(
      chat.map(async (item) => ({
        ...item,
        file: item.file
          ? {
              path: item.file.path
                ? await downloadObject(item.file.path)
                : null,
              type: item.file.type,
            }
          : undefined,
      })),
    );

    res.json(modifiedChats);
  } catch (err) {
    CatchError(err, res, "Failed to fetch chat");
  }
};
