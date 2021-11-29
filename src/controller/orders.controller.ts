import db from "../database/Connection";
import BookInstance from "../models/books_model";
import OrdersInstance from "../models/orders";
import OrderItemsInstance from "../models/order_items";
import UserInstance from "../models/user";
import { TokenDecoder } from "../middleware/userTokenDecode";
import CartInstance from "../models/cart";
import { transcode } from "buffer";
import { where } from "sequelize";

const createOrder = async (req: any, res: any) => {
  const trans = await db.transaction();
  const userId = req.body.tokenPayload.userId;
  const { books } = req.body;
  try {
    if (!userId) {
      res.status(400).json("Login before placing order");
      throw Error("Login before placing order");
      return;
    }
    const user: any = await UserInstance.findByPk(userId);
    if (!user) {
      throw Error("user not found");
      res.status(400).json("user not found");
      return;
    }
    if (user.address == null) {
      return res.status(400).json("Shipping address needed please update ");
    }
    let finalproducts = [];
    let producterror;
    for (let i = 0; i < books.length; i++) {
      let dbProduct: any = await BookInstance.findByPk(books[i].bookId);
      if (!dbProduct) {
        producterror = `${books[i].bookId} is not a valid product `;
        break;
      }
      if (dbProduct.quantity < books[i].quantity) {
        producterror = `book id ${books[i].bookId} ,${dbProduct.name} is not available `;
        break;
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
    return;
  }
};
//get all orders by admin
const getAllOrder = async (req: any, res: any) => {
  const order_items = await UserInstance.findAll({
    include: { model: OrdersInstance },
  });
  res.status(200).json(order_items);
};

const deleteOrder = async (req: any, res: any) => {
  const OrderId = req.params.id;
  try {
    const orderItems = await OrderItemsInstance.findAll({
      where: {
        orderId: OrderId,
      },
    });
    const trans = await db.transaction();
    if (orderItems.length == 0) {
      await trans.rollback();
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
};
const orderInCart = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const trans = await db.transaction();
  try {
    const userCart: any = await CartInstance.findAll({
      where: { userId: userId },
    });
    let errors: any[] = [];
    userCart.forEach(async (val: any) => {
      const product: any = await BookInstance.findByPk(val.bookId);
      if (!product) {
        errors.push(`${val.bookId} is not valid`);
      }
      if (val.quantity > product.quantity) {
        errors.push(`${product.name} has only ${product.quantity} in stock`);
      }
    });
    if (errors.length) {
      return res.status(400).json(errors);
    }

    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const Order: any = await OrdersInstance.create(
      {
        userId: userId,
        orderDate: date,
      },
      { transaction: trans }
    );
    const OrderId = Order.ordersId;
    for (let i = 0; i < userCart.length; i++) {
      await BookInstance.increment(
        { quantity: -userCart[i].quantity },
        { where: { bookId: userCart[i].bookId }, transaction: trans }
      );
      await OrderItemsInstance.create(
        {
          orderId: OrderId as number,
          bookId: userCart[i].bookId as number,
          quantity: userCart[i].quantity as number,
        },
        { transaction: trans }
      );
    }
    res.status(200).json(Order);
    await trans.commit();
  } catch (err) {
    await trans.rollback();
    res.status(200).json(err);
  }
};

const findOrderByUser = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const orders: any = await OrdersInstance.findAll({
    where: { userId: userId },
    include: { model: BookInstance },
  });
  let result: any = [];
  orders.forEach((order: any) => {
    let sum: number = 0;
    order.books.forEach((product: any) => {
      const temp = product.price * product.order_items.quantity;
      sum = sum + temp;
    });
    const orderDetails = {
      orderId: order.ordersId,
      date: order.orderDate,
      total_price: sum,
    };
    result.push(orderDetails);
  });
  res.status(200).json(result);
};

const findOrderItemsByUser = async (req: any, res: any) => {
  const { userId } = req.body.tokenPayload;
  const { id } = req.params;
  const order: any = await OrdersInstance.findOne({
    where: { ordersId: id, userId: userId },
    include: { model: BookInstance },
  });
  const orderItems: any = [];
  order.books.forEach((product: any) => {
    const temp = {
      bookId: product.bookId,
      name: product.name,
      quantity: product.order_items.quantity,
      price: product.price,
    };

    orderItems.push(temp);
  });
  res.send(orderItems);
};

export {
  createOrder,
  deleteOrder,
  getAllOrder,
  orderInCart,
  findOrderByUser,
  findOrderItemsByUser,
};
