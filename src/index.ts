const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
import jt from "jsonwebtoken";
const cookieParser = require("cookie-parser");
import { createTransport, Transport, Transporter } from "nodemailer";
import UserInstance from "./models/user";
import db from "./database/Connection";
import { check, validationResult } from "express-validator";
import jwt from "./jwt";
const { validateTokens } = require("./jwt");
const { createtokens } = require("./jwt");
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => {
  console.log("running");
});
const transporter = createTransport({
  service: "FastMail",

  auth: {
    user: "sarathkumar@fastmail.com",
    pass: "7uurug4dpgyun65c",
  },
});
app.post(
  "/register",
  check("email", "email required").isEmail(),
  check("password", "Password Required").notEmpty(),
  async (req: any, res: any) => {
    const { username, password, email } = req.body;

    const validationresult = validationResult(req);
    if (!validationresult.isEmpty()) {
      res.status(400).json(validationresult.array());
    }
    try {
      const emailcheck = await UserInstance.findAll({
        where: { email: email },
        raw: true,
      });
      if (emailcheck.length > 0) {
        res.status(400).json({ err: "Email already exist" });
      }

      const createUser = bcrypt.hash(password, 10).then((hash: any) => {
        UserInstance.create({
          username: username,
          password: hash,
          email: email,
          confirmed: true,
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      });
      const emailToken = jt.sign({ username: username }, "jwtsecret", {
        expiresIn: "1d",
      });
      console.log(`This is email token: ${emailToken}`);
      const url = `http://localhost:3001/confirmation/${emailToken}`;

      await transporter.sendMail({
        to: `gikoli3815@dukeoo.com`,
        subject: "Confirm Email",
        text: "confirm this email",
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      });
      createUser.then(() => res.json("USER REGISTERED"));
    } catch (err) {
      console.log(err);
      return res.json({ error: err });
    }
  }
);

app.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  const user = await UserInstance.findOne({ where: { username: username } });
  if (!user) {
    res.status(400).json({ error: "user dosent exist" });
  }
  const userConfirmed = (val: any) => {
    if ("confirmed" in val) {
      console.log(val.confirmed);
      return val.confirmed;
    }
  };
  if (!userConfirmed) {
    throw Error("Email is not confirmed");
  }

  try {
    const pwd = (user: any) => {
      return user.password;
    };
    const dbpass = pwd(user);
    bcrypt.compare(password, dbpass).then((match: any) => {
      if (!match) {
        res.status(400).json({ error: "Wrong pass" });
      } else {
        const accessTokens = createtokens(user);
        res.cookie("access-token", accessTokens, {
          maxAge: 86400000,
          httpOnly: true,
        });
        res.json("LOGGED IN");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/profile", validateTokens, (req: any, res: any) => {
  res.json("GOT IT BUDDY");
});

db.sync().then(() => {
  console.log("DB Connected");
});
