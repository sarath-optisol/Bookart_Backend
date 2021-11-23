import { verify } from "jsonwebtoken";
import AdminInstance from "../models/admin_model";
import { getToken } from "./jwt";
const validateTokens = async (req: any, res: any, next: any) => {
  const token = getToken(req);
  if (!token) {
    return res.status(400).json({ err: "please login first" });
  }
  try {
    const validToken = verify(token, "jwtsecret") as object;
    req.body.tokenPayload = validToken;
    return next();
  } catch (err) {
    return res.status(400).json({ error: `Invalid token ${err}` });
  }
};
const adminvalidate = async (req: any, res: any, next: any) => {
  const token = getToken(req);
  if (!token) {
    return res.status(400).json({ err: "please login first" });
  }
  try {
    const validToken: any = verify(token, "jwtsecret");
    const adminUsername = validToken.username;

    const admin = await AdminInstance.findAll({
      where: { username: adminUsername },
    });
    if (admin.length <= 0) {
      res.status(400).json("Users cannot acess admin page");
      throw Error("Users cannot acess admin page");
      return;
    } else {
      return next();
    }
  } catch (err: any) {
    return res.status(400).json({ err: err.message });
  }
};
export { validateTokens, adminvalidate };
