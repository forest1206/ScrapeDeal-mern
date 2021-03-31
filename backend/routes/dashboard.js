import express from "express";
import { getDashboardData } from "../controllers/dashboard.js";
import { hasRole, protect, ROLES } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, hasRole(ROLES.Admin), getDashboardData);

export default router;
