import { Router } from "express";
import { emailSubscriptionController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", emailSubscriptionController.addEmailSubscription)
router.get("/list", authenticated, isAdmin, emailSubscriptionController.listEmailSubscription);
router.get("/:id", authenticated, isAdmin, emailSubscriptionController.getEmailSubscription)//req.params.id
router.patch("/:id", authenticated, isAdmin, emailSubscriptionController.updateEmailSubscription)
router.delete("/:id", authenticated, isAdmin, emailSubscriptionController.deleteEmailSubscription)//[auth, admin,

export default router;