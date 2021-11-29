import {
  userLogout,
  registerUser,
  confirmEmail,
  loginUser,
  updateAddress,
  updateMobile,
  changePassword,
} from "../controller/user.controller";
import { validateTokens } from "../middleware/validateTokens";
import {
  registerValdiator,
  loginValidator,
  mobileValidate,
} from "../middleware/validators";
import express from "express";
const router = express.Router();

router.post("/user/register", registerValdiator, registerUser);
router.post("/user/login", loginValidator, loginUser);
router.get("/user/confirmation/:token", confirmEmail);
router.get("/user/logout", validateTokens, userLogout);
router.get("/user/profile", validateTokens);
router.put("/user/address", validateTokens, updateAddress);
router.put("/user/mobile", [validateTokens, mobileValidate], updateMobile);
router.put("/user/password", validateTokens, changePassword);
export { router as userRoutes };
