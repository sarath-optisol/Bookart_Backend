import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";
import OrdersInstance from "./orders";

interface User {
  userId?: number;
  username: string;
  password: string;
  email: string;
  confirmed: Boolean;
  address?: string;
  mobile?: string;
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
    },
  },
  {
    sequelize: db,
    modelName: "user",
    timestamps: false,
  }
);
UserInstance.hasMany(OrdersInstance, { foreignKey: "userId" });
