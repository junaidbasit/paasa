import { Router } from "express";
import { donationController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", donationController.addDonation)
router.get("/list", authenticated, isAdmin, donationController.listDonations);


export default router;