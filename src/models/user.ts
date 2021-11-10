import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";

interface User {
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
      defaultValue: true,
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
    tableName: "user",
  }
);
