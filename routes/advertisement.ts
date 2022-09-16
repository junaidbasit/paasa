import { Router } from "express";
import { advertisementController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", authenticated, isAdmin, advertisementController.addAdvertisement)
router.get("/list", authenticated, isAdmin, advertisementController.listAdvertisement);
router.get("/:page", advertisementController.getAdvertisementByPage)//req.params.id
router.patch("/:id", authenticated, isAdmin, advertisementController.updateAdvertisement)
router.delete("/:id", authenticated, isAdmin, advertisementController.deleteAdvertisement)//[auth, admin,

export default router;