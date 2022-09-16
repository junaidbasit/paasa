import { Router } from "express";
import { systemController } from "../controllers"
import { authenticated } from "../services/auth-service";

const router = Router();

router.get("/allStatus", authenticated, systemController.listStatus);
router.get("/userRoles", authenticated, systemController.listUserRoles);

export default router;
