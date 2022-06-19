const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, 'Email must be valid "example@example.com" '],
    unique: [true, "This email is already used"],
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, "firstName is required"],
    minlength: [3, "firstName length must be between 3 and 20"],
    maxlength: [20, "firstName length must be between 3 and 20"],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
    minlength: [3, "lastName length must be between 3 and 20"],
    maxlength: [20, "lastName length must be between 3 and 20"],
  },
  // telephone: {
  //     type: Number,
  //     required: [true, 'Telephone is required'],
  //     validate: {
  //         validator: function(val) {
  //             return ((val.toString().length >= 10) && (val.toString().length <= 14))
  //         },
  //         message: `Telephone must be valid`
  //     }
  // },
  profilePicture: {
    type: String,
  },
  token: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  role: {
    type: String,
    enum: ["admin", "restaurant", "client"],
    default: "client",
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
