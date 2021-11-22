import { sign, verify, decode } from "jsonwebtoken";
import AdminInstance from "../models/admin_model";

const createtokens = (user: any) => {
  const acessToken = sign(
    { username: user.username, id: user.userId },
    "jwtsecret"
  );
  return acessToken;
};

const createAdmintokens = (admin: any) => {
  const acessToken = sign(
    { username: admin.username, adminId: admin.adminId },
    "jwtsecret"
  );
  return acessToken;
};

const validateTokens = async (req: any, res: any, next: any) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ err: "User not authenticated" });
  }
  try {
    const validToken = verify(accessToken, "jwtsecret");
    req.authenticated = true;
    return next();
  } catch (err) {
    return res.status(400).json({ err: err });
  }
};
const adminvalidate = async (req: any, res: any, next: any) => {
  const token = req.cookies["access-token"];

  try {
    const decoded = decode(token, { complete: true });
    const username = decoded?.payload.username;
    const admin = await AdminInstance.findAll({
      where: { username: username },
    });
    if (admin.length <= 0) {
      res.status(400).json("Users cannot acess admin page");
      throw Error("Users cannot acess admin page");
      return;
    } else {
      return next();
    }
  } catch (err) {
    return res.status(400).json({ err: err });
  }
};

export { createtokens, validateTokens, adminvalidate, createAdmintokens };
