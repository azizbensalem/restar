const mongoose = require("mongoose");

const PlatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    photo: { type: String },
    body: { type: String },
    video: { type: String },
    model3D: { type: String },
    allergAlim: { type: String },
    prix: { type: Number },
    promotion: { type: String },
    isActive: Boolean,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plat", PlatSchema);
