import mongoose, { model, Schema } from "mongoose";

const friendSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    friend: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["requested", "accepted"],
      default: "requested",
    }
    // type: {
    //   type: String,
    //   enum: ["sent", "recieved"],
    //   default: "sent",
    // },
  },
  { timestamps: true },
);

friendSchema.pre("save", async function () {
  try {
    const count = await model("Friend").countDocuments({
      user: this.user,
      friend: this.friend,
    });

    if (count > 0) {
      throw new Error("Friend request already sent");
    }
  } catch (err) {
    throw new Error("Failed to send friend request");
  }
});

const FriendModel = model("Friend", friendSchema);

export default FriendModel;
