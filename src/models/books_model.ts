import { Sequelize, DataTypes } from "sequelize";
import { Model } from "sequelize";
import db from "../database/Connection";

interface Book {
  name: string;
  price: number;
  authorname: string;
  publisher: string;
  image: string;
  releasedate: Date;
  language: string;
  description: string;
}
export default class BookInstance extends Model<Book> {}

BookInstance.init(
  {
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
  },
  {
    sequelize: db,
    tableName: "book",
  }
);
