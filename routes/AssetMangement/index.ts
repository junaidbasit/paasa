import { Router } from "express";
import assetRoutes from "./asset";
import assetBookingRoutes from "./asset-booking";
import assetIssueRoutes from "./asset-issue";



const router = Router();

router.use("/asset", assetRoutes);
router.use("/assetBooking", assetBookingRoutes);
router.use("/assetIssue", assetIssueRoutes)

export default router;
