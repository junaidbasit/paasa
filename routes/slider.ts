import { Router } from "express";
import { sliderController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", authenticated, isAdmin, sliderController.addSlider)
router.get("/list", sliderController.listSlider);
router.get("/:id", authenticated, sliderController.getSlider)//req.params.id
router.patch("/:id", authenticated, isAdmin, sliderController.updateSlider)
router.delete("/:id", authenticated, isAdmin, sliderController.deleteSlider)//[auth, admin,

export default router;