import { createtokens } from "../middleware/jwt";
import AdminInstance from "../models/admin_model";
import JWT from "jsonwebtoken";

const adminlogin = async (req: any, res: any) => {
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
};

const adminProfile = async (req: any, res: any) => {
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

    res.status(200).json("Admin profile view");
  } catch (err) {
    console.log(err);
  }
};

export { adminProfile, adminlogin };
