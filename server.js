const express = require("express");
const cors = require("cors");

// connexion avec le fichier .env
require("dotenv").config();

// connexion avec BD
require("./config/database").connect();

const app = express();

// Donner accès à la partie front pour pouvoir consommer la partie backend
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Les routes de l'app
require("./app/routes/user")(app);
require("./app/routes/plat")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
