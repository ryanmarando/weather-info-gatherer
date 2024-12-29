import express from "express";
import inputController from "../controllers/inputs.js";
import processMediaUpload from "../middleware/processMediaUpload.js";
import deleteMediaMiddleware from "../middleware/deleteMediaMiddleware.js";
import multer from "multer";
import validateWeatherInput from "../middleware/validation.js";
import xss from "../middleware/xss.js";
export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
upload.single("image");
const router = express.Router();
router.get("/", inputController.getWeatherInputs);
router.post("/", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), xss, validateWeatherInput.validateWeatherInput, processMediaUpload, inputController.createWeatherInput);
router.delete("/:id", inputController.deleteWeatherInput, deleteMediaMiddleware);
router.patch("/:id", xss, validateWeatherInput.validateWeatherInput, inputController.editWeatherInput);
export default router;
