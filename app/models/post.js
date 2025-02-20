const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      // required: true,
    },
    photo: {
      type: String,
      //   required: true,
    },
    video: {
      type: String,
      //   required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
