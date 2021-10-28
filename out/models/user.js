"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('bookart', 'root', '', { host: 'localhost', dialect: 'mariadb' });
const STRING=require("sequelize");

    const Users = sequelize.define("User", {
        username: {
            type: STRING.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: STRING.STRING,
            allowNull: false,
        },
    });
   module.exports=Users;