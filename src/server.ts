// config.get("PORT");
// console.log(`++++++++++++++++${config.get("PORT")}++++++++++++++`);
// const apiDoc = Yaml.load("../swagger.yaml");
// dotenv.config({ path: "./environement.env" });
// import swaggerUI from "swagger-ui-express";
// import Yaml from "yamljs";
// import Config from "config";
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
// import dotenv from "dotenv";
// require("dotenv").config();

const cors = require("cors");
import config from "./helper/config";
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

const stripe = new Stripe(config.STRIPE_KEY, { apiVersion: "2020-08-27" });
const server = app.listen(config.PORT, () => {
  console.log("running");
});
db.sync().then(() => {
  console.log("DB connected");
});
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
// app.use("/api-docs", swaggerUI.serve, swaggerUI.serveFiles(apiDoc));
app.use(userRoutes);
app.use(adminRouter);
app.use(bookRouter);
app.use(orderRouter);
app.use(cartRouter);
export { server, stripe };
