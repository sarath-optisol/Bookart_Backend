"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sequelize_1 = require("sequelize");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const sequelize = new sequelize_1.Sequelize('bookart', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});
const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established sucessfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
main();