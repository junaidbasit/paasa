import { Router } from "express";
import { paymentController } from "../controllers"
import { authenticated } from "../services/auth-service";

const router = Router();
router.post("/createPayment", authenticated, paymentController.processPayment)
router.post("/createDonatePayment", paymentController.processDonatePayment)


export default router;