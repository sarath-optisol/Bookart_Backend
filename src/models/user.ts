import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";
import config from "../helper/config";
import BookInstance from "./books_model";
import CartInstance from "./cart";
import OrdersInstance from "./orders";
import PaymentInstance from "./payment";

interface User {
  userId?: number;
  customerId?: string;
  username: string;
  password: string;
  email: string;
  confirmed: Boolean;
  address?: string;
  mobile?: number;
  isAdmin: boolean;
}
export default class UserInstance extends Model<User> {}

UserInstance.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    customerId: {
      type: DataTypes.STRING,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.BIGINT,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "user",
    paranoid: true,
  }
);
UserInstance.hasMany(OrdersInstance, { foreignKey: "userId" });

UserInstance.belongsToMany(BookInstance, {
  through: CartInstance,
  foreignKey: "userId",
  as: "BooksInCart",
});
BookInstance.belongsToMany(UserInstance, {
  through: CartInstance,
  foreignKey: "bookId",
  as: "BooksInCart",
});
UserInstance.hasMany(PaymentInstance, { foreignKey: "userId" });
