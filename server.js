const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
require("./config/database").connect();

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/routes/menu")(app);
require("./app/routes/user")(app);
require("./app/routes/plat")(app);
require("./app/routes/post")(app);

var dir = path.join(__dirname, "/app/pictures/profile");

app.use(express.static(dir));

var dirPost = path.join(__dirname, "/app/pictures/post");

app.use(express.static(dirPost));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
