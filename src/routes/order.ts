import {
  deleteOrder,
  createOrder,
  getAllOrder,
} from "../controller/orders.controller";
import { adminvalidate, validateTokens } from "../middleware/validateTokens";
import express from "express";
const router = express.Router();

router.post("/orders/create", validateTokens, createOrder);
router.delete("/orders/delete/:id", validateTokens, deleteOrder);
router.get("/orders/get", adminvalidate, validateTokens, getAllOrder);

export { router as orderRouter };
