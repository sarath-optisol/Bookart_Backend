import { validateTokens } from "../middleware/jwt";
import { loginValidator } from "../middleware/validators";
import express from "express";
import { adminProfile, adminlogin } from "../controller/admin.controller";
const router = express.Router();

router.post("/admin", loginValidator, adminlogin);
router.get("/admin/profile", validateTokens, adminProfile);
export { router as adminRouter };
