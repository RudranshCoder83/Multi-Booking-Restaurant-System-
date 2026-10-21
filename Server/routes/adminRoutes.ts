import { Router } from "express";
import { getAdminStats, getAllRestaurant } from "../controller/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const adminRouter = Router();

adminRouter.use(protect);
adminRouter.use(adminOnly);

adminRouter.get("/restaurants", getAllRestaurant);
adminRouter.put("/restaurants/:id/approve", getAllRestaurant);
adminRouter.get("/stats", getAdminStats);

export default adminRouter;