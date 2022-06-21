import { Router } from "express";
import { planController } from "../controllers";
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
// router.post("/", planController.addPlan)
router.post("/loadPlansIntoDb", authenticated, isAdmin, planController.loadPlansIntoDb)
router.post("/userPlanActivation", authenticated, planController.userPlanActivation)
router.get("/", planController.listPlans);
router.get("/:id", planController.getPlan)//req.params.id
router.put("/:id", authenticated, isAdmin, planController.updatePlan)
// router.delete("/:id", planController.deletePlan)//[auth, admin,

export default router;