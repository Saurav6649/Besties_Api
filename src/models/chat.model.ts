import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    file: {
      path: { type: String },
      type: { type: String },
    },
  },
  { timestamps: true },
);

const ChatModel = model("Chat", chatSchema);

export default ChatModel;
