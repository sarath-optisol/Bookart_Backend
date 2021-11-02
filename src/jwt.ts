import { sign, verify } from "jsonwebtoken";

const createtokens = (user: any) => {
  const acessToken = sign(
    { username: user.username, id: user.id },
    "jwtsecret"
  );
  return acessToken;
};

module.exports = createtokens;
