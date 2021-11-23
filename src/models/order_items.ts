import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database/Connection";

interface orderItems {
  orderitemsId?: number;
  orderId: number;
  bookId: number;
  quantity: number;
  isdelete?: boolean;
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
    isdelete: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    modelName: "order_items",
    timestamps: false,
  }
);
