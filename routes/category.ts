import { Router } from "express";
import { categoryController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/", authenticated, isAdmin, categoryController.addCategory)
router.get("/", authenticated, categoryController.listCategories);
router.get("/listVehiclesByCategory/:id", categoryController.listVehiclesByCategory);
router.get("/:id", authenticated, categoryController.getCategory)//req.params.id
router.put("/:id", authenticated, isAdmin, categoryController.updateCategory)
router.delete("/:id", authenticated, isAdmin, categoryController.deleteCategory)//[auth, admin,

export default router;