const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
import  UserInstance  from "./models/user";
import db from  "./database/Connection";
app.use(express.json());
app.use(cookieParser())

app.listen(3001, () => {
  console.log("running");
});




app.post("/register", (req:any, res:any) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash:any) => {
      UserInstance.create({
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

db.sync().then(() => {
     console.log("DB Connected")
});
