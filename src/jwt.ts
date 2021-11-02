import { sign, verify } from "jsonwebtoken";

const createtokens = (user: any) => {
  const acessToken = sign(
    { username: user.username, id: user.id },
    "jwtsecret"
  );
  return acessToken;
};

const validateTokens = (req: any, res: any, next: any) => {
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

export = { createtokens, validateTokens };
