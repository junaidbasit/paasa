import { Router } from "express";
import { assetReturnController } from "../../controllers/AssetMangement"
import { authenticated } from "../../services/auth-service";
import { isAdmin } from "../../middlewares/user-validation";

const router = Router();

router.post("/calulateCharges", authenticated, assetReturnController.calulateFinalChanrges);
// router.post("/createReturn", authenticated, assetReturnController.createReturn);
// router.get("/return/:id", authenticated, isAdmin, assetReturnController.getReturn)//req.params.id
// router.get("/returnList", authenticated, isAdmin, assetReturnController.getAllVehicleReturns)



export default router;