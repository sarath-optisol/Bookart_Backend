const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const db = require("./models/index");
const {Users} = require("./models/user");
app.use(express.json());
app.use(cookieParser())
app.post("/register", (req:any, res:any) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash:any) => {
      Users.create({
        username: username,
        password: hash,
      });
    })
    .then(() => res.json("USER REGISTERED"))
    .catch((err:Error) => {
      if (err) {
        res.status(400).json({ error: err });
      }
    });
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("running");
  });
});
