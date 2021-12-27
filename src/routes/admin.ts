import { adminvalidate, validateTokens } from "../middleware/validateTokens";
import { loginValidator } from "../middleware/validators";
import express from "express";
import {
  adminProfile,
  adminlogin,
  getTotalRevenue,
} from "../controller/admin.controller";
const router = express.Router();

router.post("/admin/login", loginValidator, adminlogin);
router.get("/admin/profile", [validateTokens, adminvalidate], adminProfile);
router.get(
  "/admin/dashboard",
  [validateTokens, adminvalidate],
  getTotalRevenue
);
export { router as adminRouter };
