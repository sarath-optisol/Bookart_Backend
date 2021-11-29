import { sign } from "jsonwebtoken";
import { Request } from "express";

const createtokens = (user: any) => {
  const acessToken = sign(
    { username: user.username, userId: user.userId },
    "jwtsecret",
    { expiresIn: "3d" }
  );
  return acessToken;
};

const createAdmintokens = (admin: any) => {
  const acessToken = sign(
    { username: admin.username, adminId: admin.adminId },
    "jwtsecret",
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
