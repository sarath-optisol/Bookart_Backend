import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database/Connection";

interface orderItems {
  orderitemsId?: number;
  orderId: number;
  bookId: number;
  quantity: number;
}

export default class OrderItemsInstance extends Model<orderItems> {}

OrderItemsInstance.init(
  {
    orderitemsId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "order_items",
    paranoid: true,
  }
);
