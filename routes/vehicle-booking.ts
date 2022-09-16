import { Router } from "express";
import { vehicleBookingController } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";

const router = Router();

router.post("/calculateRent", authenticated, vehicleBookingController.calculateRent);
router.post("/addBooking", authenticated, vehicleBookingController.addbooking);
router.get("/list", authenticated, isAdmin, vehicleBookingController.getAllBookings);
router.get('/me', authenticated, vehicleBookingController.geCurrentUserBookings);
router.get("/:id", authenticated, isAdmin, vehicleBookingController.getBooking)//req.params.id
router.put("/:id", authenticated, isAdmin, vehicleBookingController.updateBooking)
router.delete("/:id", authenticated, isAdmin, vehicleBookingController.deleteBooking)
//[auth, admin,
// router.get("/discount/:id", authenticated, isAdmin, vehicleController.getVehicleDiscount)//req.params.id
// router.post("/discount", authenticated, isAdmin, vehicleController.addVehicleDiscount)
// router.put("/discount/:id", authenticated, isAdmin, vehicleController.updateVehicleDiscount)




export default router;