const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../sendEmail");
const passwordRegex = new RegExp(
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})"
);
const jwt_decode = require("jwt-decode");

exports.register = async (req, res) => {
  var response = {};

  const { email, password, firstName, lastName /*, telephone*/ } = req.body;

  if (!((email && password && lastName && firstName) /*&& telephone*/)) {
    response.code = 1;
    response.msg = "All input is required";
    res.send(response);
  } else {
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      if (!passwordRegex.test(password)) {
        response.code = 3;
        response.msg = "Unsafe password";
        res.send(response);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePicture: `http://13.36.173.35/${req.file.filename}`,
        // telephone: req.body.telephone,
        role: "client",
      });

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      user.token = token;

      await user.save();

      response.code = 0;
      response.msg = "Account has been created!";
      response.data = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // telephone: user.telephone,
        profilePicture: user.profilePicture,
        role: user.role,
        status: user.status,
        token: user.token,
      };
      res.send(response);
      sendEmail(
        user.email,
        "Please confirm your account",
        `http://13.36.173.35/api/email-confirmation/${user.token}`
      );
    } else {
      response.code = 2;
      response.msg = "Account already exist. Please Login";
      res.send(response);
    }
  }
};

exports.registerFB = async (req, res) => {
  var response = {};

  const { email, firstName, lastName /*, telephone*/ } = req.body;

  if (!((email && lastName && firstName) /*&& telephone*/)) {
    response.code = 1;
    response.msg = "All input is required";
    res.send(response);
  } else {
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePicture: req.body.profilePicture,
        // telephone: req.body.telephone,
        role: "client",
        status: "Active",
      });

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      user.token = token;

      await user.save();

      response.code = 0;
      response.msg = "Account has been created!";
      response.data = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // telephone: user.telephone,
        role: user.role,
        status: user.status,
        token: user.token,
      };
      res.send(response);
      sendEmail(
        user.email,
        "Please confirm your account",
        `http://13.36.173.35/api/email-confirmation/${user.token}`
      );
    } else {
      response.code = 2;
      response.msg = "Account already exist. Please Login";
      res.send(response);
    }
  }
};

exports.login = async (req, res) => {
  var response = {};

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      response.code = 1;
      response.msg = "All input is required";
      res.send(response);
    }

    const user = await User.findOne({ email });

    if (user != null) {
      if (bcrypt.compare(password, user.password)) {
        response.code = 0;
        response.msg = "Account found";

        const accessToken = jwt.sign(
          { user_id: user._id, email, following: user.following },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        );

        response.data = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          // telephone: user.telephone,
          role: user.role,
          status: user.status,
          token: accessToken,
        };

        res.send(response);
      } else {
        response.code = 2;
        response.msg = "Email or password incorrect";
        res.send(response);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.loginFB = async (req, res) => {
  var response = {};

  try {
    const { email } = req.body;

    if (!email) {
      response.code = 1;
      response.msg = "Email is required";
      res.send(response);
    }

    const user = await User.findOne({ email });

    if (user != null) {
      response.code = 0;
      response.msg = "Account found";

      const accessToken = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      response.data = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // telephone: user.telephone,
        role: user.role,
        status: user.status,
        token: accessToken,
      };

      res.send(response);
    } else {
      response.code = 2;
      response.msg = "Email incorrect";
      res.send(response);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.emailConfirmation = (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User Not found");
      }
      user.status = "Active";
      user
        .save()
        .then(() => {
          res.status(201).send("Your account is successfully activated");
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((e) => console.log("error", e));
};

exports.editProfile = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update this profile with id=${id} `,
        });
      } else res.send({ message: "Your profile was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating profile with id=" + id,
      });
    });
};

exports.editProfilePicture = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Profile picture to upload can not be empty!",
    });
  }
  const id = req.params.id;

  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      profilePicture: `http://13.36.173.35/${req.file.filename}`,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update this profile picture with id=${id} `,
        });
      } else
        res.send({ message: "Your profile picture was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating profile picture with id=" + id,
      });
    });
  // console.log(req.file);
  // res.send("Single FIle upload success");
};

exports.showProfile = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

exports.follow = (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  User.findByIdAndUpdate(
    req.params.id,
    {
      $push: { followers: decoded.user_id },
    },
    {
      new: true,
    },
    (err) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        decoded.user_id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
};

exports.unfollow = (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { followers: decoded.user_id },
    },
    {
      new: true,
    },
    (err) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        decoded.user_id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
};
