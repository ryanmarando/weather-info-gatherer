import express from "express";
import adminController from "../controllers/admins.js";
import xss from "../middleware/xss.js";
import validateAdminUser from "../middleware/validation.js";

const router = express.Router();

router.get("/", adminController.getAdminUsers);
router.post(
  "/",
  xss,
  validateAdminUser.validateAdminUser,
  adminController.createAdminUser
);
router.delete("/:id", adminController.deleteAdminUser);

export default router;
