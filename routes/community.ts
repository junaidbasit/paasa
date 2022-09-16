import { Router } from "express";
import { communityController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();
router.post("/add", authenticated, isAdmin, communityController.addCommunityMember)
router.get("/list", communityController.listCommunityMember);
router.get("/:id", authenticated, communityController.getCommunityMember)//req.params.id
router.patch("/:id", authenticated, isAdmin, communityController.updateCommunityMember)
router.delete("/:id", authenticated, isAdmin, communityController.deleteCommunityMember)//[auth, admin,

export default router;