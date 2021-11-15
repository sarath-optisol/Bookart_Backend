const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
import AdminInstance from "./models/admin_model";
import db from "./database/Connection";
import JWT from "jsonwebtoken";
const { validateTokens } = require("./jwt");
const { createtokens } = require("./jwt");
const { adminvalidate } = require("./jwt");
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => {
  console.log("running");
});

app.post("/admin", async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminInstance.findOne({
      where: { username: username },
    });
    if (!admin) {
      res.status(400).json("Wrong username");
      return;
    }
    const pass = (ad: any) => {
      return ad.password;
    };
    const dbpass = pass(admin);
    if (dbpass === password) {
      const accessTokens = createtokens(admin);
      res.cookie("access-token", accessTokens, {
        maxAge: 86400000,
        httpOnly: true,
      });
      res.json("Admin authenticated");
    } else {
      res.status(400).json({ err: "wrong pass" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/admin_profile", validateTokens, async (req: any, res: any) => {
  const token = req.cookies["access-token"];

  try {
    const decode = JWT.decode(token, { complete: true });
    const username = decode?.payload.username;
    const admin = await AdminInstance.findAll({
      where: { username: username },
    });
    if (admin.length <= 0) {
      res.status(400).json("Users cannot acess admin page");
      return;
    }

    res.json("Admin profile view");
  } catch (err) {
    console.log(err);
  }
});
db.sync().then(() => {
  console.log("DB Connected");
});
