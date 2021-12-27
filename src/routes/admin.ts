import { adminvalidate, validateTokens } from "../middleware/validateTokens";
import { loginValidator } from "../middleware/validators";
import express from "express";
import {
  adminProfile,
  adminlogin,
  getTotalRevenue,
  getUsersCount,
  getMostCategorysold,
} from "../controller/admin.controller";
const router = express.Router();

router.post("/admin/login", loginValidator, adminlogin);
router.get("/admin/profile", [validateTokens, adminvalidate], adminProfile);
router.get(
  "/admin/dashboard/revenue",
  [validateTokens, adminvalidate],
  getTotalRevenue
);
router.get(
  "/admin/dashboard/users",
  [validateTokens, adminvalidate],
  getUsersCount
);
router.get(
  "/admin/dashboard/category",
  [validateTokens, adminvalidate],
  getMostCategorysold
);
export { router as adminRouter };
