import { Router } from "express";
import userRoutes from "./user";
import vehicleRoutes from "./vehicle";
import categoryRoutes from "./category";

const router = Router();

router.use("/user", userRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/category", categoryRoutes);

export default router;
