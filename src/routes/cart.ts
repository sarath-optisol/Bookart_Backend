import {
  getCart,
  deleteById,
  emptycart,
  updateCart,
  addProductToCart,
} from "../controller/cart.controller";
import { validateTokens } from "../middleware/validateTokens";
import express from "express";
const router = express.Router();

router.post("/cart/create", validateTokens, addProductToCart);
router.put("/cart/update", validateTokens, updateCart);
router.delete("/cart/delete/:id", validateTokens, deleteById);
router.delete("/cart/deleteall", validateTokens, emptycart);
router.get("/cart", validateTokens, getCart);

export { router as cartRouter };
