const { User } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../sendEmail");
const crypto = require("crypto");
const Joi = require("joi");

exports.sendPasswordResetLink = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ message: "User with given email doesn't exist" });

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http:/localhost:8080/api/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send({ message: "Password reset link sent to your email account" });
  } catch (error) {
    res.send({ message: "An error occured" });
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send({ message: "User Not found" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ message: "Invalid link or expired" });

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send({ message: "Password successfully reset" });
  } catch (error) {
    res.send({ message: "An error occured" });
    console.log(error);
  }
};
