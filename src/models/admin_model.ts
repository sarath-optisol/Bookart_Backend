import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";

interface Admin {
  username: string;
  password: string;
}
export default class AdminInstance extends Model<Admin> {}

AdminInstance.init(
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
  },
  {
    sequelize: db,
    tableName: "admin",
  }
);
