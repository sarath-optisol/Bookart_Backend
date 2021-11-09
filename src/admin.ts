const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
import AdminInstance from "./models/admin_model";
import db from "./database/Connection";
const { validateTokens } = require("./jwt");
const { createtokens } = require("./jwt");
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => {
  console.log("running");
});

app.post("/admin", async (req: any, res: any) => {
  const { username, password } = req.body;
  const admin = await AdminInstance.findOne({ where: { username: username } });
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
});

app.get("/admin_profile", validateTokens, (req: any, res: any) => {
  res.json("Admin profile view");
});
db.sync().then(() => {
  console.log("DB Connected");
});
