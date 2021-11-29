import { createTransport } from "nodemailer";
import UserInstance from "../models/user";
import jt from "jsonwebtoken";
import { createtokens } from "../middleware/jwt";
const bcrypt = require("bcrypt");
import { validationResult } from "express-validator";
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

const registerUser = async (req: any, res: any) => {
  const { username, password, email } = req.body;

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

    const createUser = await bcrypt
      .hash(password, 10)
      .then(async (hash: any) => {
        await UserInstance.create({
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
    return res.json("USER REGISTERED");
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

const loginUser = async (req: any, res: any) => {
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
    await bcrypt.compare(password, dbpass).then((match: any) => {
      if (!match) {
        res.status(400).json({ error: "Wrong pass" });
      } else {
        const accessTokens = createtokens(user);
        res.status(200).json({ token: accessTokens });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
const confirmEmail = async (req: any, res: any) => {
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
};

const userLogout = (req: any, res: any) => {
  const token = req.body.tokenPayload;
  try {
    res.status(200).json({ token: "" });
  } catch (err) {
    console.log(err);
  }
};
const updateAddress = async (req: any, res: any) => {
  const userId = req.body.tokenPayload.userId;
  const address = req.body.address;
  try {
    const user = await UserInstance.findByPk(userId);
    if (!user) {
      return res.status(400).json("No user found");
    }
    if (!address) {
      return res.status(400).json("Send address");
    }
    const updated = await user.update({ address: address });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const updateMobile = async (req: any, res: any) => {
  const userId = req.body.tokenPayload.userId;
  const mobile = req.body.mobile;
  try {
    const user = await UserInstance.findByPk(userId);
    if (!user) {
      return res.status(400).json("No user found");
    }
    if (!mobile) {
      return res.status(400).json("Send address");
    }
    const updated = await user.update({ mobile: mobile });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
const changePassword = async (req: any, res: any) => {
  const userId = req.body.tokenPayload.userId;
  try {
    const { oldPassword, newPassword } = req.body;
    const user: any = await UserInstance.findByPk(userId);
    if (!user) {
      return res.status(400).json("User doesnt exist");
    }
    const userPass = user.password;
    await bcrypt.compare(oldPassword, userPass).then((match: any) => {
      if (!match) {
        throw Error("Wrong pass");
      }
    });
    console.log("enter");
    const change = await bcrypt.hash(newPassword, 10);
    await user.update({ password: change });
    res.status(200).json("password updated");
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};
export {
  userLogout,
  registerUser,
  confirmEmail,
  loginUser,
  updateAddress,
  updateMobile,
  changePassword,
};
