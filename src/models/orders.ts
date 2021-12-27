import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../database/Connection";
import config from "../helper/config";
import BookInstance from "./books_model";
import OrderItemsInstance from "./order_items";
import PaymentInstance from "./payment";
import UserInstance from "./user";

interface orders {
  ordersId?: number;
  userId: number;
  orderDate: String;
}
export default class OrdersInstance extends Model<orders> {}

OrdersInstance.init(
  {
    ordersId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, modelName: "orders", paranoid: true }
);
OrdersInstance.belongsToMany(BookInstance, {
  through: OrderItemsInstance,
  foreignKey: "orderId",
});
BookInstance.belongsToMany(OrdersInstance, {
  through: OrderItemsInstance,
  foreignKey: "bookId",
});
OrdersInstance.hasOne(PaymentInstance, { foreignKey: "orderId" });
