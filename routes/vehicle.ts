import { Router } from "express";
import { vehicleController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();

router.get("/discounts", authenticated, isAdmin, vehicleController.listVehiclesDiscount);
router.get("/discount/:id", authenticated, isAdmin, vehicleController.getVehicleDiscount)//req.params.id
router.post("/discount", authenticated, isAdmin, vehicleController.addVehicleDiscount)
router.put("/discount/:id", authenticated, isAdmin, vehicleController.updateVehicleDiscount)

router.get("/", vehicleController.listVehicles);
router.get("/:id", vehicleController.getVehicle)//req.params.id
router.post("/", authenticated, isAdmin, vehicleController.addVehicle)
router.put("/:id", authenticated, isAdmin, vehicleController.updateVehicle)
router.delete("/:id", authenticated, isAdmin, vehicleController.deleteVehicle)//[auth, admin,



export default router;