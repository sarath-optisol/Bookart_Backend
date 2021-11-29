import {
  userLogout,
  registerUser,
  confirmEmail,
  loginUser,
} from "../controller/user.controller";
import { validateTokens } from "../middleware/validateTokens";
import { registerValdiator, loginValidator } from "../middleware/validators";
import express from "express";
const router = express.Router();

router.post("/user/register", registerValdiator, registerUser);
router.post("/user/login", loginValidator, loginUser);
router.get("/user/confirmation/:token", confirmEmail);
router.get("/user/logout", validateTokens, userLogout);
router.get("/user/profile", validateTokens);
export { router as userRoutes };
