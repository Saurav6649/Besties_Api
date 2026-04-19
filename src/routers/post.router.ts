import express from "express";
import { createPost, fetchPost } from "../controllers/post.controllers";

const PostRouter = express.Router();

PostRouter.post("/", createPost);
PostRouter.get("/", fetchPost);

export default PostRouter;
