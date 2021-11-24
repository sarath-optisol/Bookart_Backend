import db from "./database/Connection";
import express from "express";
import { userRoutes } from "./routes/user";
import { adminRouter } from "./routes/admin";
import { bookRouter } from "./routes/book";
import { orderRouter } from "./routes/order";
import { cartRouter } from "./routes/cart";
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.listen(3001, () => {
  console.log("running");
});
db.sync().then(() => {
  console.log("DB connected");
});

app.use(userRoutes);
app.use(adminRouter);
app.use(bookRouter);

app.use(orderRouter);
app.use(cartRouter);
