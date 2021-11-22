import {
  userLogout,
  registerUser,
  confirmEmail,
  loginUser,
} from "../controller/user.controller";
import { validateTokens } from "../middleware/jwt";
import { registerValdiator, loginValidator } from "../middleware/validators";
import express from "express";
const router = express.Router();

router.post("/register", registerValdiator, registerUser);
router.post("/login", loginValidator, loginUser);
router.get("/confirmation/:token", confirmEmail);
router.get("/logout", validateTokens, userLogout);
router.get("/profile", validateTokens);
export { router as userRoutes };
