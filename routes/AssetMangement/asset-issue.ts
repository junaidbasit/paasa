import { Router } from "express";
import { assetIssueController } from "../../controllers/AssetMangement"
import { authenticated } from "../../services/auth-service";
import { isAdmin } from "../../middlewares/user-validation";

const router = Router();

router.post("/createIssue", authenticated, assetIssueController.createIssue);
router.get("/issue/:id", authenticated, isAdmin, assetIssueController.getIssue)//req.params.id
router.get("/issueList", authenticated, isAdmin, assetIssueController.getAllAssetssues)

//req.params.id

// router.get("/list", authenticated, isAdmin, vehicleBookingController.getAllBookings);
// router.get("/:id", authenticated, isAdmin, vehicleBookingController.getBooking)//req.params.id
// router.put("/:id", authenticated, isAdmin, vehicleBookingController.updateBooking)
// router.delete("/:id", authenticated, isAdmin, vehicleBookingController.deleteBooking)//[auth, admin,
// router.get("/discount/:id", authenticated, isAdmin, vehicleController.getVehicleDiscount)//req.params.id
// router.post("/discount", authenticated, isAdmin, vehicleController.addVehicleDiscount)
// router.put("/discount/:id", authenticated, isAdmin, vehicleController.updateVehicleDiscount)




export default router;