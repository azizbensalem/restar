const Post = require("../models/post");
const jwt_decode = require("jwt-decode");

exports.findAllPosts = async (req, res) => {
  Post.find()
    .populate("postedBy", "_id firstName lastName email")
    .populate("comments.postedBy", "_id firstName lastName email")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
};

//à régler
exports.findPosts = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  Post.find({ postedBy: { $in: decoded.following } })
    .populate("postedBy", "_id firstName lastName email")
    .populate("comments.postedBy", "_id firstName lastName email")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createPost = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  const { body } = req.body;
  // if (!body) {
  //   return res.status(422).json({ error: "All inputs are required" });
  // }
  const post = new Post({
    body,
    photo: `http://13.36.173.35/${req.files["photo"][0].filename}`,
    video: `http://13.36.173.35/${req.files["video"][0].filename}`,
    postedBy: decoded.user_id,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.myPosts = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  Post.find({ postedBy: decoded.user_id })
    .populate("postedBy", "_id firstName lastName email")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.like = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { likes: decoded.user_id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.dislike = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { likes: decoded.user_id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.comment = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  const comment = {
    text: req.body.text,
    postedBy: decoded.user_id,
  };
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id firstName lastName email")
    .populate("postedBy", "_id firstName lastName email")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

exports.delete = async (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id firstName lastName email")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === decoded.user_id.toString()) {
        post
          .remove()
          .then((result) => {
            res.send("post deleted");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};
