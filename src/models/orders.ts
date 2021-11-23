import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../database/Connection";
import BookInstance from "./books_model";
import OrderItemsInstance from "./order_items";
import UserInstance from "./user";

interface orders {
  ordersId?: number;
  userId: number;
  orderDate: String;
  isdelete?: boolean;
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
    isdelete: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize: db, modelName: "orders", timestamps: false }
);
OrdersInstance.belongsToMany(BookInstance, {
  through: OrderItemsInstance,
  foreignKey: "orderId",
});
BookInstance.belongsToMany(OrdersInstance, {
  through: OrderItemsInstance,
  foreignKey: "bookId",
});
