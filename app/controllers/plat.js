const Plat = require("../models/plat");
const jwt_decode = require("jwt-decode");

// add plat
exports.create = (req, res) => {
  const token = req.params.token;
  var decoded = jwt_decode(token);

  const plat = new Plat({
    title: req.body.title,
    photo: req.body.photo,
    body: req.body.body,
    video: req.body.video,
    model3D: req.body.model3D,
    allergAlim: req.body.allergAlim,
    prix: req.body.prix,
    promotion: req.body.promotion,
    menu: req.body.menu,
    postedBy: decoded.user_id,
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
  Plat.find({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error",
      });
    });
};

// get all plats
exports.findAll = (req, res) => {
  Plat.find();
  var total = Plat.count();
  Plat.find({})
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
  const id = req.params.id;
  const token = req.params.token;
  var decoded = jwt_decode(token);

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  Plat.findOneAndUpdate(
    { _id: req.params.id, postedBy: decoded.user_id },
    {
      $set: {
        title: req.body.title,
        photo: req.body.photo,
        body: req.body.body,
        video: req.body.video,
        model3D: req.body.model3D,
        allergAlim: req.body.allergAlim,
        prix: req.body.prix,
        promotion: req.body.promotion,
        menu: req.body.menu,
      },
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
  const id = req.params.id;
  const token = req.params.token;
  var decoded = jwt_decode(token);

  Plat.findOneAndRemove({ _id: req.params.id, postedBy: decoded.user_id })
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
  const token = req.params.token;
  var decoded = jwt_decode(token);

  Plat.deleteMany({ postedBy: decoded.user_id })
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
