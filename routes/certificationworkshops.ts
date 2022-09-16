import { Router } from "express";
import { certificationWorkshopsController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", authenticated, isAdmin, certificationWorkshopsController.addCertificationworkshop)
router.get("/list", certificationWorkshopsController.listCertificationworkshop);
router.get("/:id", authenticated, certificationWorkshopsController.getCertificationworkshop)//req.params.id
router.patch("/:id", authenticated, isAdmin, certificationWorkshopsController.updateCertificationworkshop)
router.delete("/:id", authenticated, isAdmin, certificationWorkshopsController.deleteCertificationworkshop)//[auth, admin,

export default router;