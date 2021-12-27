import PaymentInstance from "../models/payment";
import OrdersInstance from "../models/orders";
import BookInstance from "../models/books_model";

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
    res.status(400).json(err);
  }
};
