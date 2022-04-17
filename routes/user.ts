import { Router } from "express";
import { userController } from "../controllers"

const router = Router();

router.get("/", userController.getCurrentUser);
router.get("/:id", )//req.params.id
router.post("/", )
router.put("/:id",)
router.delete("/:id",)//[auth, admin,

export default router;