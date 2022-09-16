import { Router } from "express";
import { sharedController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { uploadImage } from "../middlewares/file-middleware";

const router = Router();

router.post("/uploadImages", authenticated, uploadImage.array('images'), sharedController.uploadImages);


export default router;
