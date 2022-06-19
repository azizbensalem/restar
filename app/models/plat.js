const mongoose = require("mongoose");

const PlatSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true },
    model3D: { type: String, required: true },
    allergAlim: { type: String, required: true },
    prix: { type: Number, required: true },
    promotion: { type: String },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
    isActive: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plat", PlatSchema);
