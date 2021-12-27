import db from "./database/Connection";
import express from "express";
import { userRoutes } from "./routes/user";
import { adminRouter } from "./routes/admin";
import { bookRouter } from "./routes/book";
import { orderRouter } from "./routes/order";
import { cartRouter } from "./routes/cart";
import { Stripe } from "stripe";
import path from "path";
import "ejs";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());
const stripe = new Stripe(
  "sk_test_51K26zMSJNnVUq47sA3hiDYhtgdSBNLiVGMDOfZYh1X4jJaHNl7K4chSQdpaiwk1UBTNxQetpJIrMYmFCgFZ3zqR4009lhW2jZ3",
  { apiVersion: "2020-08-27" }
);
const server = app.listen(3001, () => {
  console.log("running");
});
db.sync().then(() => {
  console.log("DB connected");
});
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(userRoutes);
app.use(adminRouter);
app.use(bookRouter);
app.use(orderRouter);
app.use(cartRouter);
export { server, stripe };
