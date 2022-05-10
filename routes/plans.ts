import { Router } from "express";
import { planController } from "../controllers"

const router = Router();
// router.post("/", planController.addPlan)
router.post("/loadPlansIntoDb", planController.loadPlansIntoDb)
router.get("/", planController.listPlans);
router.get("/:id", planController.getPlan)//req.params.id
router.put("/:id", planController.updatePlan)
// router.delete("/:id", planController.deletePlan)//[auth, admin,

export default router;