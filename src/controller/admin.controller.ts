import { createAdmintokens, createtokens } from "../middleware/jwt";
import AdminInstance from "../models/admin_model";
import JWT from "jsonwebtoken";
import PaymentInstance from "../models/payment";
import sequelize from "sequelize";
import { all } from "sequelize/types/lib/operators";

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

const getTotalRevenue = async (req: any, res: any) => {
  try {
    const allPayment: any = await PaymentInstance.findAll({
      attributes: [[sequelize.fn("sum", sequelize.col("amount")), "total"]],
      raw: true,
    });
    console.log(allPayment[0].total);
  } catch (err) {}
};

export { adminProfile, adminlogin, getTotalRevenue };
