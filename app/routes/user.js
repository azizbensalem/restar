module.exports = (app) => {
  const users = require("../controllers/user");
  const passwordReset = require("../controllers/passwordReset");
  var router = require("express").Router();

  router.post("/register", users.register);
  router.post("/login", users.login);
  router.post("/forgot-password", passwordReset.sendPasswordResetLink);
  router.post("/password-reset/:userId/:token", passwordReset.resetPassword);
  router.get("/email-confirmation/:token", users.emailConfirmation);
  router.post("/profile/edit/:id", users.editProfile);
  router.get("/profile/:id", users.showProfile);

  app.use("/api", router);
};
