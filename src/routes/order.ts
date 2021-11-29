import {
  deleteOrder,
  createOrder,
  getAllOrder,
  orderInCart,
  findOrderByUser,
  findOrderItemsByUser,
} from "../controller/orders.controller";
import { adminvalidate, validateTokens } from "../middleware/validateTokens";
import express from "express";
const router = express.Router();

router.post("/orders/create", validateTokens, createOrder);
router.delete("/orders/delete/:id", validateTokens, deleteOrder);
router.get("/orders/get", adminvalidate, validateTokens, getAllOrder);
router.post("/orders/cart", validateTokens, orderInCart);
router.get("/orders/user", validateTokens, findOrderByUser);
router.get("/orders/user/:id", validateTokens, findOrderItemsByUser);

export { router as orderRouter };
