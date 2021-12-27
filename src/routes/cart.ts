import {
  getCart,
  deleteById,
  emptycart,
  updateCart,
  addProductToCart,
} from "../controller/cart.controller";
import { validateTokens } from "../middleware/validateTokens";
import express from "express";
import { cartvalidation, idValidation } from "../middleware/validators";
const router = express.Router();

router.post("/cart/create", [validateTokens, cartvalidation], addProductToCart);
router.put("/cart/update", [validateTokens, cartvalidation], updateCart);
router.delete("/cart/delete/:id", [validateTokens, idValidation], deleteById);
router.delete("/cart/deleteall", validateTokens, emptycart);
router.get("/cart", validateTokens, getCart);

export { router as cartRouter };
