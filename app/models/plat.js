const mongoose = require("mongoose");

const PlatSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    video: { type: String },
    model3D: { type: String },
    allergAlim: { type: String },
    prix: { type: Number },
    promotion: { type: String },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
    isActive: Boolean,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plat", PlatSchema);
