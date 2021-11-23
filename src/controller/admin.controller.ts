import { createAdmintokens, createtokens } from "../middleware/jwt";
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
      const accessTokens = createAdmintokens(admin);

      res.status(200).json({ token: accessTokens });
    } else {
      res.status(400).json({ err: "wrong pass" });
    }
  } catch (err) {
    console.log(err);
  }
};

const adminProfile = async (req: any, res: any) => {
  try {
    res.status(200).json("Admin profile view");
  } catch (err) {
    console.log(err);
  }
};

export { adminProfile, adminlogin };
