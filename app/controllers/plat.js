const Plat = require("../models/plat");
const jwt_decode = require("jwt-decode");

// add plat
exports.create = (req, res) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(' ')[1];
  // var decoded = jwt_decode(token);

  const plat = new Plat({
    titre: req.body.titre,
    image: req.body.image,
    description: req.body.description,
    video: req.body.video,
    model3D: req.body.model3D,
    allergAlim: req.body.allergAlim,
    prix: req.body.prix,
    promotion: req.body.promotion,
    menu: req.body.menu,
    // user: decoded.user_id,
  });

  plat
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

// get plat by plat id
exports.findPlat = (req, res) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(' ')[1];
  // var decoded = jwt_decode(token);

  Plat.find({ _id: req.params.id /* , user: decoded.user_id */ })
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

// get all plats
exports.findAll = (req, res) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(" ")[1];
  // var decoded = jwt_decode(token);

  Plat.find({
    /* user: decoded.user_id */
  });
  var total = Plat.count();
  Plat.find()
    .then((data) => {
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", total);
      res.json({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

// update plat
exports.update = (req, res) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(" ")[1];
  // var decoded = jwt_decode(token);

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;

  Plat.findOneAndUpdate(
    { _id: req.params.id /*, user: decoded.user_id */ },
    {
      titre: req.body.titre,
      image: req.body.image,
      description: req.body.description,
      video: req.body.video,
      model3D: req.body.model3D,
      allergAlim: req.body.allergAlim,
      prix: req.body.prix,
      promotion: req.body.promotion,
      menu: req.body.menu,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update plat with id=${id}. Maybe plat was not found!`,
        });
      } else res.send({ message: "plat was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating plat with id=" + id,
      });
    });
};

// delete plat
exports.delete = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  var decoded = jwt_decode(token);

  const id = req.params.id;

  Plat.findOneAndRemove({ _id: req.params.id, user: decoded.user_id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete plat with id=${id}. Maybe plat was not found!`,
        });
      } else {
        res.send({
          message: "Plat was deleted successfully!",
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Could not delete plat with id=" + id,
      });
    });
};

// delete all plats
exports.deleteAll = (req, res) => {
  Plat.deleteMany({ user: decoded.user_id })
    .then((data) => {
      res.send({
        message: `${data.deletedCount} plats were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all plats.",
      });
    });
};
