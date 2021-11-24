import { Sequelize, DataTypes } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";

interface Book {
  bookId?: number;
  name: string;
  price: number;
  authorname: string;
  publisher: string;
  image: string;
  releasedate: Date;
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
      type: DataTypes.STRING,
    },
    releasedate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    language: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
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
