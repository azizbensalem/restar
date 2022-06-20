module.exports = app => {
  const menus = require("../controllers/menu");
  const auth = require("../middleware/auth");
  var router = require("express").Router();

  router.post("/", menus.create);
  router.put("/:id", menus.addPlat);
  router.get("/:id", menus.findMenuWithPlats);

  app.use('/api/menu', router);
};