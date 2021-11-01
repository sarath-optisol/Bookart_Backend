"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const user_1 = __importDefault(require("./models/user"));
const Connection_1 = __importDefault(require("./database/Connection"));
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => {
    console.log("running");
});
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt
        .hash(password, 10)
        .then((hash) => {
        user_1.default.create({
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
Connection_1.default.sync().then(() => {
    console.log("DB Connected");
});
