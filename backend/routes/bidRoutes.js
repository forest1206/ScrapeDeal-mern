import express from "express";
const router = express.Router();

import {
  awardBid,
  cancelAward,
  createBid,
  deleteBid,
  getBidById,
  getBidsByProductId,
  getBidsByUserId,
  updateBid,
} from "../controllers/bidController.js";
import { hasRole, protect, ROLES } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(
    protect,
    hasRole(ROLES.Customer, ROLES.Merchant, ROLES.Admin),
    createBid
  );

router.route("/product/:id").get(getBidsByProductId);
router.route("/user/:id").get(getBidsByUserId);
router
  .route("/:id")
  .get(getBidById)
  .delete(
    protect,
    hasRole(ROLES.Customer, ROLES.Merchant, ROLES.Admin),
    deleteBid
  )
  .put(
    protect,
    hasRole(ROLES.Customer, ROLES.Merchant, ROLES.Admin),
    updateBid
  );
router
  .route("/award/:id")
  .post(protect, hasRole(ROLES.Merchant, ROLES.Admin), awardBid);
router
  .route("/cancel/:id")
  .post(protect, hasRole(ROLES.Merchant, ROLES.Admin), cancelAward);

export default router;
