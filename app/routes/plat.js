module.exports = (app) => {
  const plats = require("../controllers/plat");
  var router = require("express").Router();

  router.post("/create/:token", plats.create);
  router.get("/:id", plats.findPlat);
  router.get("/", plats.findAll);
  router.post("/update/:id/:token", plats.update);
  router.delete("/delete/:id/:token", plats.delete);
  router.delete("/delete/:token", plats.deleteAll);

  app.use("/api/plats", router);
};
