"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const db = mysql_1.default.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    database: "bookart"
});
app.listen(3001, () => {
    console.log("connected to port 3001");
});
app.get("/booksget", (res, req) => {
    db.query("SELECT * FROM book", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
        }
    });
});
