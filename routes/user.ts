import { Router } from "express";
import { userController } from "../controllers";
import { authenticated } from "../services/auth-service";
const router = Router();

// router.get("/:id", )//req.params.id
// router.post("/", )
// router.put("/:id",)
// router.delete("/:id",)//[auth, admin,

router.get("/me", authenticated, userController.getCurrentUser);
router.post("/login", userController.loginUser);
router.post("/register", userController.signupUser);
router.post("/forgot-password", userController.forgotPassword); // forgot password
router.post("/change-password", authenticated, userController.changePassword); // change/update password
router.put("/update", authenticated, userController.updateUser);

export default router;