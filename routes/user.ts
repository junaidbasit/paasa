import { Router } from "express";
import { userController } from "../controllers";
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();

// router.get("/:id", )//req.params.id
// router.post("/", )
// router.put("/:id",)
// router.delete("/:id",)//[auth, admin,

router.get("/me", authenticated, userController.getCurrentUser);
router.get('/allUsers', authenticated, isAdmin, userController.getAllUsers);
router.post("/login", userController.loginUser);
router.post("/register", userController.signupUser);
router.post("/forgotPassword", userController.forgotPassword); // forgot password
router.post("/changePassword", authenticated, userController.changePassword);
router.post("/sendEmailVerification", userController.sendEmailVerification); // change/update password
router.post("/emailVerification", userController.emailVerification); // change/update password
router.put("/update", authenticated, userController.updateUser);
router.patch("/updateProfile", authenticated, userController.updateProfile)
router.post('/contactus', userController.sendContactUsEmail)



export default router;