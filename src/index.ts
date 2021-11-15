const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
import jt, { JwtPayload } from "jsonwebtoken";
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
interface TokenInterface {
  user: string;
  iat: Number;
  exp: Number;
}
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
      return;
    }
    try {
      const emailcheck = await UserInstance.findAll({
        where: { email: email },
        raw: true,
      });
      const usernameCheck = await UserInstance.findAll({
        where: { username: username },
      });
      if (usernameCheck.length > 0) {
        res.status(400).json({ err: "username already exist" });
        return;
      }
      if (emailcheck.length > 0) {
        res.status(400).json({ err: "Email already exist" });
        return;
      }
      console.log("hello");
      const createUser = bcrypt.hash(password, 10).then((hash: any) => {
        UserInstance.create({
          username: username,
          password: hash,
          email: email,
          confirmed: false,
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      });
      const emailToken = jt.sign({ user: username }, "jwtsecret", {
        expiresIn: "1d",
      });
      console.log(`This is email token: ${emailToken}`);
      const url = `http://localhost:3001/confirmation/${emailToken}`;

      await transporter.sendMail({
        from: "sarathkumar@fastmail.com",
        to: `${email}`,
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

  try {
    if (!userConfirmed(user)) {
      res.status(400).json({ err: "Email is not confirmed" });
      throw Error("Email is not confirmed");
    }
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

app.get("/confirmation/:token", async (req: any, res: any) => {
  try {
    const decoded = jt.verify(req.params.token, "jwtsecret");

    await UserInstance.update(
      { confirmed: true },
      { where: { username: (decoded as unknown as TokenInterface).user } }
    );
    res.status(200).json("Email verified");
  } catch (err) {
    res.status(400).json({ error: err });
    console.log(err);
  }
});

app.get("/profile", validateTokens, (req: any, res: any) => {
  res.json("GOT IT BUDDY");
});

app.get("/logout", (req: any, res: any) => {
  try {
    res.cookie("access-token", "", { maxAge: 1 });
    res.status(200).json("logged out sucessfully");
  } catch (err) {
    console.log(err);
  }
});
db.sync().then(() => {
  console.log("DB Connected");
});
