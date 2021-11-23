import { Model, DataTypes } from "sequelize";
import db from "../database/Connection";

interface cart {
  userId?: number;
  cartId?: number;
  quantity: number;
  isdelete?: boolean;
}
export default class CartInstance extends Model<cart> {}

CartInstance.init(
  {
    userId: {
      type: DataTypes.NUMBER,
    },
    cartId: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
    isdelete: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    modelName: "cart",
  }
);
