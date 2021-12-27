import { Sequelize, DataTypes } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";
import config from "../helper/config";

interface Book {
  bookId?: number;
  name: string;
  price: number;
  authorname: string;
  publisher: string;
  image: string;
  releasedate: string;
  language: string;
  description: string;
  quantity: number;
  category: string;
}
export default class BookInstance extends Model<Book> {}

BookInstance.init(
  {
    bookId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    authorname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    publisher: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    releasedate: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    language: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "All",
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "book",
    paranoid: true,
  }
);
