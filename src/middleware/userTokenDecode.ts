import { decode } from "jsonwebtoken";
import UserInstance from "../models/user";

export const TokenDecoder = async (token: any) => {
  const decoded: any = await decode(token, { complete: true });
  const userId: any = decoded?.payload.userId;
  const User: any = await UserInstance.findByPk(userId);
  if (!User) {
    throw Error("User Id is not valid");
    return;
  }

  return userId;
};
