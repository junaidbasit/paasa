import { Router } from "express";
import userRoutes from "./user";
import vehicleRoutes from "./vehicle";
import categoryRoutes from "./category";
import plansRoutes from "./plans";
import vehicleBookingRoutes from "./vehicle-booking";
import vehicleIssueReturn from "./vehicle-issue-return";
import systemRoutes from "./system";
import payment from "./payment";
import donation from "./donate";
import community from "./community";
import advertisement from "./advertisement";
import slider from "./slider";
import certificationworkshops from "./certificationworkshops";
import emailSubscription from "./emailSubscription";
import assetMangement from "./AssetMangement";
import shared from "./shared";


const router = Router();

router.use("/user", userRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/vehicleBooking", vehicleBookingRoutes);
router.use("/category", categoryRoutes);
router.use("/plans", plansRoutes);
router.use("/system", systemRoutes);
router.use("/vehicleIssueReturn", vehicleIssueReturn);
router.use("/payment", payment);
router.use("/donation", donation)
router.use("/communityMember", community)
router.use("/advertisement", advertisement)
router.use("/slider", slider)
router.use("/certificationworkshops", certificationworkshops)
router.use("/emailSubscription", emailSubscription)
router.use("/assetMangement", assetMangement);
router.use("/shared", shared)


export default router;
