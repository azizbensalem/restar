module.exports = (app) => {
  const posts = require("../controllers/post");
  var router = require("express").Router();

  const multer = require("multer");

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./app/pictures/post");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });

  const upload = multer({ storage: fileStorageEngine });

  router.get("/all", posts.findAllPosts);
  router.get("/:token", posts.findPosts);
  router.post("/create/:token", posts.createPost);
  router.get("/mypost/:token", posts.myPosts);
  router.post(
    "/update/:postId/:token",
    upload.fields([
      { name: "photo" },
      // { name: "video", maxCount: 1 }
    ]),
    posts.updatePost
  );
  router.post(
    "/update/video/:postId/:token",
    upload.fields([{ name: "video", maxCount: 1 }]),
    posts.updatePostVideo
  );
  router.put("/like/:postId/:token", posts.like);
  router.put("/dislike/:postId/:token", posts.dislike);
  router.put("/comment/:postId/:token", posts.comment);
  router.delete("/delete/:postId/:token", posts.delete);

  app.use("/api/post", router);
};
