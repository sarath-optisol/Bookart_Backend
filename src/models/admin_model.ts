import { Sequelize, DataTypes, useInflection } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";

interface Admin {
  adminId?: number;
  username: string;
  password: string;
}
export default class AdminInstance extends Model<Admin> {}

AdminInstance.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  },
  {
    sequelize: db,
    modelName: "admin",
    timestamps: false,
  }
);
