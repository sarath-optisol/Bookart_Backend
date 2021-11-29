import { Sequelize } from "sequelize";
const db = new Sequelize("bookart", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  logging: false,
});

export default db;
