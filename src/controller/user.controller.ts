import { createTransport } from "nodemailer";
import UserInstance from "../models/user";
import jt from "jsonwebtoken";
import { createtokens } from "../middleware/jwt";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { stripe } from "../server";
import config from "../helper/config";
interface TokenInterface {
  user: string;
  iat: Number;
  exp: Number;
}
const transporter = createTransport({
  service: "FastMail",

  auth: {
    user: config.NODEMAILER_USER,
    pass: config.NODEMAILER_PASSWORD,
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
      return res.status(400).json({ err: "username already exist" });
    }
    if (emailcheck.length > 0) {
      return res.status(400).json({ err: "Email already exist" });
    }

    const createUser = await bcrypt
      .hash(password, 10)
      .then(async (hash: any) => {
        await UserInstance.create({
          username: username,
          password: hash,
          email: email,
          confirmed: false,
          isAdmin: false,
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    const emailToken = jt.sign({ user: username }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    // console.log(`This is email token: ${emailToken}`);
    const url = `http://localhost:3001/user/confirmation/${emailToken}`;

    await transporter.sendMail({
      from: config.NODEMAILER_USER,
      to: `${email}`,
      subject: "Confirm Email",
      text: "confirm this email",
      html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
    });
    const { id } = await stripe.customers.create({
      name: username,
      email: email,
    });
    await UserInstance.update({ customerId: id }, { where: { email: email } });
    return res.status(200).json("USER REGISTERED");
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

const loginUser = async (req: any, res: any) => {
  const { username, password } = req.body;
  const user: any = await UserInstance.findOne({
    where: { username: username },
  });
  try {
    if (!user) {
      return res.status(400).json({ error: "user dosent exist" });
    }
    const userConfirmed = (val: any) => {
      if ("confirmed" in val) {
        return val.confirmed;
      }
    };

    if (!userConfirmed(user)) {
      return res.status(400).json({ error: "Email is not confirmed" });
    }
    const pwd = (user: any) => {
      return user.password;
    };

    const dbpass = pwd(user);
    await bcrypt.compare(password, dbpass).then((match: any) => {
      if (!match) {
        res.status(400).json({ error: "Wrong password" });
      } else {
        const accessTokens = createtokens(user);
        res.status(200).json({ token: accessTokens, isAdmin: user.isAdmin });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
const confirmEmail = async (req: any, res: any) => {
  try {
    const decoded = jt.verify(req.params.token, config.JWT_SECRET);

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
      return res.status(400).json({ error: "No user found" });
    }
    if (!address) {
      return res.status(400).json({ error: "Send address" });
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
  console.log(mobile);
  try {
    const user = await UserInstance.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }
    if (!mobile) {
      return res.status(400).json({ error: "Send mobile number" });
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
      return res.status(400).json({ error: "User doesnt exist" });
    }
    const userPass = user.password;
    await bcrypt.compare(oldPassword, userPass).then((match: any) => {
      if (!match) {
        throw Error("Wrong pass");
      }
    });
    const change = await bcrypt.hash(newPassword, 10);
    await user.update({ password: change });
    res.status(200).json("password updated");
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const forgotPassword = async (req: any, res: any) => {
  const { email } = req.body;
  try {
    const user: any = await UserInstance.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ error: "Email id doesnt exist" });
    }
    const userId = user.userId;
    const secret = "jwtsecret" + user.password;
    const emailToken = jt.sign({ userId: userId, email: user.email }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:3000/reset-password/${userId}/${emailToken}`;
    await transporter.sendMail({
      from: config.NODEMAILER_USER,
      to: `${email}`,
      subject: "Reset Password",
      html: `This is a one time link to change the password: <br></br>
      <a href="${link}">${link}</a>`,
    });
    return res.status(200).json("Link to change password is sent to your mail");
  } catch (err) {
    res.status(200).json(err);
  }
};
const getResetPassword = async (req: any, res: any) => {
  const { id, token } = req.params;
  try {
    const user: any = await UserInstance.findByPk(id);
    if (!user) {
      return res.status(400).json("Email id doesnt exist ");
    }
    const secret = config.JWT_SECRET + user.password;
    const verified = jt.verify(token, secret);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Invalid address" });
  }
};
const resetPassword = async (req: any, res: any) => {
  const { id, token } = req.params;
  const { password, confirmpass } = req.body;

  try {
    const user: any = await UserInstance.findByPk(id);
    if (!user) {
      return res.status(400).json({ error: "Email id doesnt exist " });
    }
    const secret = config.JWT_SECRET + user.password;
    const verified = await jt.verify(token, secret);
    await bcrypt.hash(password, 10).then(async (hash: any) => {
      await user.update({ password: hash });
    });
    res.status(200).json("password changed");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
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
  forgotPassword,
  resetPassword,
  getResetPassword,
};
