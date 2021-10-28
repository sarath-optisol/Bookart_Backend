"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('bookart', 'root', '', { host: 'localhost', dialect: 'mariadb' });
module.exports = sequelize;
const checkcon = async () => {
    try {
        await sequelize.authenticate();
        console.log("connection sucess");
    }
    catch (err) {
        console.log(err);
    }
};
checkcon();
