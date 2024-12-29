import { Router } from "express";
import * as authController from "../controllers/auth.js";
import validateAdminUser from "../middleware/validation.js";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.createAdminUser);

export default router;
