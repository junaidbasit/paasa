import { Router } from "express";
import { categoryController } from "../controllers"

const router = Router();
router.post("/", categoryController.addCategory)
router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory)//req.params.id
router.put("/:id", categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)//[auth, admin,

export default router;