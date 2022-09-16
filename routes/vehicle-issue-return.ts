import { Router } from "express";
import { vehicleIssueReturn } from "../controllers"
import { authenticated } from "../services/auth-service";
import { isAdmin } from "../middlewares/user-validation";
import { uploadImage } from "../middlewares/file-middleware";

const router = Router();

router.post("/uploadImages", authenticated, uploadImage.array('images'), vehicleIssueReturn.uploadImages);
router.post("/createIssue", authenticated, vehicleIssueReturn.createIssue);
router.get("/issue/:id", authenticated, isAdmin, vehicleIssueReturn.getIssue)//req.params.id
router.get("/issueList", authenticated, isAdmin, vehicleIssueReturn.getAllVehicleIssues)

router.post("/createReturn", authenticated, vehicleIssueReturn.createReturn);
router.get("/return/:id", authenticated, isAdmin, vehicleIssueReturn.getReturn)//req.params.id
router.get("/returnList", authenticated, isAdmin, vehicleIssueReturn.getAllVehicleReturns)

router.post("/createIssueReturnCharges", authenticated, vehicleIssueReturn.createIssueReturnCharges);
router.get("/issueReturnCharges", authenticated, isAdmin, vehicleIssueReturn.getIssueReturnCharges)//req.params.id
router.patch("/issueReturnCharges", authenticated, isAdmin, vehicleIssueReturn.updateIssueReturnCharges)
router.post("/calculateReturnCharges", authenticated, isAdmin,vehicleIssueReturn.calculateReturnCharges)
router.post('/calulateFinalChanrges', authenticated, isAdmin, vehicleIssueReturn.calulateFinalChanrges)
//req.params.id

// router.get("/list", authenticated, isAdmin, vehicleBookingController.getAllBookings);
// router.get("/:id", authenticated, isAdmin, vehicleBookingController.getBooking)//req.params.id
// router.put("/:id", authenticated, isAdmin, vehicleBookingController.updateBooking)
// router.delete("/:id", authenticated, isAdmin, vehicleBookingController.deleteBooking)//[auth, admin,
// router.get("/discount/:id", authenticated, isAdmin, vehicleController.getVehicleDiscount)//req.params.id
// router.post("/discount", authenticated, isAdmin, vehicleController.addVehicleDiscount)
// router.put("/discount/:id", authenticated, isAdmin, vehicleController.updateVehicleDiscount)




export default router;