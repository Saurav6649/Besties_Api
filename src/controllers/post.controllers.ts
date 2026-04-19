import { Request, Response } from "express";
import { SessionInterface } from "../middleware/auth.middleware";
import PostModel from "../models/post.model";
import { CatchError } from "../utils/error";

export const createPost = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;
    const post = await PostModel.create(req.body);
    res.json(post);
  } catch (err) {
    CatchError(err, res, "Failed to upload post");
  }
};

export const fetchPost = async (req: SessionInterface, res: Response) => {
  try {
    const post = await PostModel.find().sort({ createdAt: -1 });
    res.json(post);
  } catch (err) {
    CatchError(err, res, "Failed to fetch post");
  }
};
