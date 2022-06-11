import { Router } from "express";
import userRoutes from "./user";
import vehicleRoutes from "./vehicle";
import categoryRoutes from "./category";
import plansRoutes from "./plans";
import vehicleBookingRoutes from "./vehicle-booking";
import vehicleIssueReturn from "./vehicle-issue-return";
import systemRoutes from "./system";

const router = Router();

router.use("/user", userRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/vehicleBooking", vehicleBookingRoutes);
router.use("/category", categoryRoutes);
router.use("/plans", plansRoutes);
router.use("/system", systemRoutes);
router.use("/vehicleIssueReturn", vehicleIssueReturn);
export default router;
