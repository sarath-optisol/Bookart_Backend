import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";
import BookInstance from "./books_model";
import CartInstance from "./cart";
import OrdersInstance from "./orders";

interface User {
  userId?: number;
  username: string;
  password: string;
  email: string;
  confirmed: Boolean;
  address?: string;
  mobile?: number;
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
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.INTEGER,
      validate: {
        max: 10,
      },
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
