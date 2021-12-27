import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../database/Connection";

interface payment {
  payId: string;
  userId: number;
  status: boolean;
  orderId: number;
  date: string;
  amount?: number;
}

export default class PaymentInstance extends Model<payment> {}

PaymentInstance.init(
  {
    payId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: "payment",
  }
);
