import { Router } from "express";
import { assetBookingController } from "../../controllers/AssetMangement"
import { authenticated } from "../../services/auth-service";
import { isAdmin } from "../../middlewares/user-validation";

const router = Router();

router.post("/addAssetToBundle", authenticated, assetBookingController.addAssetToBundle);
router.post("/addBooking", authenticated, assetBookingController.addbooking);
router.get("/list", authenticated, isAdmin, assetBookingController.getAllBookings);
router.get('/me', authenticated, assetBookingController.geCurrentUserBookings);
router.get("/:id", authenticated, isAdmin, assetBookingController.getBooking)//req.params.id
router.patch("/:id", authenticated, isAdmin, assetBookingController.updateBooking)
// router.delete("/:id", authenticated, isAdmin, assetBookingController.deleteBooking)

export default router;
