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
app.get("/books", (req, res) => {
    db.query("SELECT * FROM book", (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
app.post("/book", (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    db.query("INSERT INTO books (name,price,description) VALUES (?,?,?)", [name, price, description], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Book created");
        }
    });
});
app.put("/update/book", (req, res) => {
    const id = req.body.id;
    const price = req.body.price;
    db.query("UPDATE books SET price=? WHERE ID=?", [price, id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
app.delete("/delete/book/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM books WHERE ID =?", id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
