import cookieParser from "cookie-parser";
import express from "express";
import db from "../database/Connection";
import BookInstance from "../models/books_model";
import OrdersInstance from "../models/orders";
import OrderItemsInstance from "../models/order_items";
import UserInstance from "../models/user";
import { TokenDecoder } from "../middleware/userTokenDecode";
import { adminvalidate, validateTokens } from "../middleware/jwt";

const app = express();
app.listen(3001, () => {
  console.log("app is connected in port 3001");
});
db.sync().then(() => {
  console.log("DB connected ");
});
app.use(cookieParser());
app.post(
  "orders/create",
  [validateTokens, adminvalidate],
  async (req: any, res: any) => {
    const trans = await db.transaction();
    const accessToken = req.cookies["access-token"];
    const { products } = req.body;
    try {
      if (!accessToken) {
        res.status(400).json("Login before placing order");
        return;
      }
      const userId = TokenDecoder(accessToken) as unknown as number;
      const user: any = await UserInstance.findByPk(userId);
      if (!user) {
        return res.status(400).send("user not found");
      }
      if (user.address === null) {
        return res.status(400).send("Shipping address needed please update ");
      }
      let finalproducts = [];
      let producterror;
      for (let i = 0; i < products.length; i++) {
        let dbProduct: any = await BookInstance.findByPk(products[i].id);
        if (!dbProduct) {
          return (producterror = `${products[i].id} is not a valid product `);
        }
        if (dbProduct.noofbooks < products[i].quantity) {
          return (producterror = `${products[i].id} is not available `);
        }
        finalproducts.push(dbProduct);
      }
      if (producterror) {
        return res.status(400).json(producterror);
      }
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const createOrder: any = OrdersInstance.create(
        { userId: userId, orderDate: date },
        { transaction: trans }
      );

      for (let i = 0; i < products.length; i++) {
        await BookInstance.increment(
          { noofbooks: -products[i].quantity },
          { where: { bookId: products[i].bookId }, transaction: trans }
        );
        await OrderItemsInstance.create(
          {
            bookId: products[i].bookId as number,
            orderId: createOrder.orderId as number,
            quantity: products[i].quantity as number,
          },
          { transaction: trans }
        );
      }
      await trans.commit();
      res.send(createOrder);
    } catch (err) {
      await trans.rollback();
      res.status(400).json(err);
    }
  }
);

app.get(
  "orders/get",
  [adminvalidate, validateTokens],
  async (req: any, res: any) => {
    const order_items = await UserInstance.findAll({
      include: { model: OrdersInstance },
    });
    res.status(200).json(order_items);
  }
);

app.delete(
  "orders/delete/:id",
  [adminvalidate, validateTokens],
  async (req: any, res: any) => {
    const OrderId = req.params.id;
    const trans = await db.transaction();
    try {
      const orderItems = await OrderItemsInstance.findAll({
        where: {
          orderId: OrderId,
        },
      });
      if (orderItems.length == 0) {
        return res.status(400).json("order doesnt exist");
      } else {
        orderItems.forEach(async (order: any) => {
          await BookInstance.increment(
            { noofbooks: order.quantity },
            { where: { bookId: order.bookId }, transaction: trans }
          );
          await order.destroy({ transaction: trans });
        });
        const orders = await OrdersInstance.findOne({
          where: {
            ordersId: OrderId,
          },
        });
        if (!orders) {
          res.send("no order there");
        } else {
          await orders?.destroy({ transaction: trans });
          await trans.commit();
          res.send("order cancelled");
        }
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
