import { Sequelize } from "sequelize";
import config from "../helper/config";
const db = new Sequelize(
  config.db.database_name,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    storage: config.db.storage,
    logging: false,
  }
);
export default db;
