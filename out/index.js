"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const db = require("./models/index");
const cookieParser = require("cookie-parser");
const Users = require("./models/user");
app.use(express.json());
app.use(cookieParser());
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt
        .hash(password, 10)
        .then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
    })
        .then(() => res.json("USER REGISTERED"))
        .catch((err) => {
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
