module.exports = app => {
  const plats = require("../controllers/plat");
  const auth = require("../middleware/auth");
  var router = require("express").Router();

  router.post("/", plats.create);
  router.get("/:id", plats.findPlat);
  // router.get("/", auth, plats.findAll);
  router.get("/", plats.findAll);
  router.put("/:id", plats.update);
  router.delete("/:id", plats.delete);
  router.delete("/", plats.deleteAll);

  app.use('/api/plats', router);
};