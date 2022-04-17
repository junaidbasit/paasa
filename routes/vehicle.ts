import { Router } from "express";
import { vehicleController } from "../controllers"

const router = Router();

router.get("/", vehicleController.listVehicles);
router.get("/:id", vehicleController.getVehicle)//req.params.id
router.post("/", vehicleController.addVehicle)
router.put("/:id", vehicleController.updateVehicle)
router.delete("/:id", vehicleController.deleteVehicle)//[auth, admin,

export default router;