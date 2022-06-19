module.exports = (app) => {
  const users = require("../controllers/user");

  const passwordReset = require("../controllers/passwordReset");

  var router = require("express").Router();

  const multer = require("multer");

  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./app/pictures/profile");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });

  const upload = multer({ storage: fileStorageEngine });

  router.post("/register", upload.single("image"), users.register);
  router.post("/register/facebook", users.registerFB);
  router.post("/login", users.login);
  router.post("/login/facebook", users.loginFB);
  router.post("/forgot-password", passwordReset.sendPasswordResetLink);
  router.post("/password-reset/:userId/:token", passwordReset.resetPassword);
  router.get("/email-confirmation/:token", users.emailConfirmation);
  router.post("/profile/edit/:id", users.editProfile);
  router.post(
    "/profile/edit/picture/:id",
    upload.single("image"),
    users.editProfilePicture
  );
  router.get("/profile/:id", users.showProfile);
  router.put("/follow/:id/:token", users.follow);
  router.put("/unfollow/:id/:token", users.unfollow);

  app.use("/api", router);
};
