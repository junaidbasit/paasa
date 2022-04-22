import { Router } from "express";
import { userController } from "../controllers"

const router = Router();

// router.get("/:id", )//req.params.id
// router.post("/", )
// router.put("/:id",)
// router.delete("/:id",)//[auth, admin,

router.get("/me", userController.getCurrentUser);

router.post("/login", userController.loginUser);
router.post("/register", userController.signupUser);
router.post("/forgot-password", userController.forgotPassword); // forgot password
router.post("/change-password", middleWare.varifyToken, userController.changePassword); // change/update password
router.put("/update", middleWare.varifyToken, userController.updateUser); 

export default router;