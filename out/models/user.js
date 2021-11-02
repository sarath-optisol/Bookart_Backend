"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const Connection_1 = __importDefault(require("../database/Connection"));
class UserInstance extends sequelize_2.Model {}
exports.default = UserInstance;
UserInstance.init(
  {
    username: {
      allowNull: false,
      unique: true,
      type: sequelize_1.DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: sequelize_1.DataTypes.STRING,
    },
  },
  {
    sequelize: Connection_1.default,
    tableName: "user",
  }
);
