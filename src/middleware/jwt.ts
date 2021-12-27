import { sign } from "jsonwebtoken";
import { Request } from "express";
import config from "../helper/config";

const createtokens = (user: any) => {
  const acessToken = sign(
    { username: user.username, userId: user.userId },
    config.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return acessToken;
};

const createAdmintokens = (admin: any) => {
  const acessToken = sign(
    { username: admin.username, adminId: admin.adminId },
    config.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return acessToken;
};

const getToken = (req: any) => {
  if (req.headers.auth && req.headers.auth.split(" ")[0] === "Bearer") {
    return req.headers.auth.split(" ")[1];
  }
  console.log(req.headers.auth);
  return null;
};

export { createtokens, createAdmintokens, getToken };
