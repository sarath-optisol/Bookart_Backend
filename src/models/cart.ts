import { Model, DataTypes } from "sequelize";
import db from "../database/Connection";

interface cart {
  userId?: number;
  cartId?: number;
  bookId?: number;
  quantity: number;
}
export default class CartInstance extends Model<cart> {}

CartInstance.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    bookId: {
      type: DataTypes.INTEGER,
    },

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    modelName: "cart",
    paranoid: true,
  }
);
