import { decode } from "jsonwebtoken";
import UserInstance from "../models/user";

export const TokenDecoder = async (token: any) => {
  const decoded = decode(token, { complete: true });
  const userId = decoded?.payload.id;
  const User = await UserInstance.findByPk(userId);
  if (!User) {
    throw Error("User Id is not valid");
    return;
  }

  return userId;
};
