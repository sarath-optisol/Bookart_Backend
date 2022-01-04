import { createAdmintokens, createtokens } from "../middleware/jwt";
import AdminInstance from "../models/admin_model";
import PaymentInstance from "../models/payment";
import sequelize from "sequelize";
import UserInstance from "../models/user";
import OrdersInstance from "../models/orders";
import OrderItemsInstance from "../models/order_items";
import BookInstance from "../models/books_model";

const adminlogin = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const admin: any = await AdminInstance.findOne({
      where: { username: username },
    });
    if (!admin) {
      res.status(400).json({ error: "Wrong username" });
      return;
    }
    const pass = (ad: any) => {
      return ad.password;
    };
    const dbpass = pass(admin);
    if (dbpass === password) {
      const accessTokens = createAdmintokens(admin);
      res.status(200).json({ token: accessTokens, isAdmin: admin.isAdmin });
    } else {
      res.status(400).json({ error: "wrong pass" });
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
    return res.status(200).json(allPayment[0].total);
  } catch (err) {
    res.status(400).json({ error: "Cant fetch total amount" });
  }
};

const getUsersCount = async (req: any, res: any) => {
  try {
    const userCount: any = await UserInstance.findAll({
      attributes: [
        [sequelize.fn("count", sequelize.col("userId")), "totalcount"],
      ],
      raw: true,
    });
    return res.status(200).json({ userCount: userCount[0].totalcount });
  } catch (err) {
    res.status(400).json({ error: "Cannot return User count" });
  }
};

const getMostCategorysold = async (req: any, res: any) => {
  try {
    const payments = await PaymentInstance.findAll({
      where: { status: 1 },
    });
    const map = new Map();
    const orderIdsInPayment: any = [];
    payments.forEach((pay: any) => {
      const orderId = pay.orderId;
      orderIdsInPayment.push(orderId);
    });
    await orderIdsInPayment.forEach(async (ID: any) => {
      const orderItems: any = await OrdersInstance.findAll({
        where: { ordersId: ID },
        include: BookInstance,
        raw: true,
      });
      orderItems.forEach(async (item: any) => {
        const category = item["books.category"];
        const quantity = item["books.order_items.quantity"];
        if (map.has(category)) {
          map.set(`${category}`, map.get(category) + quantity);
        } else {
          map.set(`${category}`, quantity);
        }
      });
    });

    let final: any = [];
    setTimeout(() => {
      const mapSort1 = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
      mapSort1.forEach((value, key) => {
        final.push({
          category: key,
          amount: value,
        });
      });
    }, 1000);
    let final2: any = [];
    setTimeout(() => {
      final2 = final;
      res.status(200).json(final2);
    }, 1500);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

export {
  adminProfile,
  adminlogin,
  getTotalRevenue,
  getUsersCount,
  getMostCategorysold,
};
