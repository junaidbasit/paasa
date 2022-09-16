import { Router } from "express";
import { assetController } from "../../controllers/AssetMangement"
import { authenticated } from "../../services/auth-service";
import { isAdmin } from "../../middlewares/user-validation";

const router = Router();
router.post("/add", authenticated, isAdmin, assetController.addAsset)
router.get("/list", assetController.listAssets);
router.get("/listAssetsByAdmin", authenticated, isAdmin, assetController.listAssetsByAdmin);
router.get("/:id", authenticated, assetController.getAsset)//req.params.id
router.patch("/:id", authenticated, isAdmin, assetController.updateAsset)
router.delete("/:id", authenticated, isAdmin, assetController.deleteAsset)//[auth, admin,

export default router;