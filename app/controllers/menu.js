const Menu = require("../models/menu");
const jwt_decode = require('jwt-decode');
const generatorQR = require("../generatorQR");


// add menu
exports.create = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  var decoded = jwt_decode(token);

  if (!req.body.titre) {
    res.status(400).send("Content can not be empty!");
    return;
  }

  const menu = new Menu({
    titre: req.body.titre,
    plat: req.body.plat,
    user: decoded.user_id,
  });

  menu.save()
    .then(data => {
      res.send(data);
      generatorQR(data.id, data.id);
    })
    .catch(err => {
      res.status(500).send(err.message || "Some error occurred while creating the Menu.");
    });
};

// add plat
exports.addPlat = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  var decoded = jwt_decode(token);

  if (!req.body.plat) {
    res.status(400).send("Content can not be empty!");
    return;
  }

  Menu.findByIdAndUpdate({ _id: req.params.id, user: decoded.user_id },{
  $push:{plat: req.body.plat}
  },{
      new:true
  }).exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
  
};

// get plats by menu id
exports.findMenuWithPlats = (req, res) => {
 Menu.findById(req.params.id)
    .populate("plat").exec()
    .then((data) => res.json(data))
    .catch(err => {
      res.status(500).send(err.message || "Error");
    });
};


