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
app.use(express.json());
app.post("/orders/create", [validateTokens], async (req: any, res: any) => {
  const trans = await db.transaction();
  const accessToken = req.cookies["access-token"];
  const { books } = req.body;
  try {
    if (!accessToken) {
      res.status(400).json("Login before placing order");
      return;
    }
    const userId: any = await TokenDecoder(accessToken);
    const user: any = await UserInstance.findByPk(userId);
    if (!user) {
      return res.status(400).json("user not found");
    }
    if (user.address == null) {
      return res.status(400).json("Shipping address needed please update ");
    }
    let finalproducts = [];
    let producterror;
    for (let i = 0; i < books.length; i++) {
      let dbProduct: any = await BookInstance.findByPk(books[i].bookId);
      if (!dbProduct) {
        return (producterror = `${books[i].bookId} is not a valid product `);
      }
      if (dbProduct.quantity < books[i].quantity) {
        return (producterror = `${books[i].bookId} is not available `);
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
    const createOrder: any = await OrdersInstance.create(
      { userId: userId, orderDate: date },
      { transaction: trans }
    );

    for (let i = 0; i < books.length; i++) {
      await BookInstance.increment(
        { quantity: -books[i].quantity },
        { where: { bookId: books[i].bookId }, transaction: trans }
      );
      await OrderItemsInstance.create(
        {
          bookId: books[i].bookId as number,
          orderId: createOrder.ordersId as number,
          quantity: books[i].quantity as number,
        },
        { transaction: trans }
      );
    }
    await trans.commit();
    res.status(200).json(createOrder);
  } catch (err) {
    console.log(err);
    await trans.rollback();
    res.status(400).json(err);
  }
});

app.get(
  "/orders/get",
  [adminvalidate, validateTokens],
  async (req: any, res: any) => {
    const order_items = await UserInstance.findAll({
      include: { model: OrdersInstance },
    });
    res.status(200).json(order_items);
  }
);

app.delete(
  "/orders/delete/:id",
  [validateTokens],
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
            { quantity: order.quantity },
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
          res.status(400).json("no order there");
        } else {
          await orders?.destroy({ transaction: trans });
          await trans.commit();
          res.status(200).json("order cancelled");
        }
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
