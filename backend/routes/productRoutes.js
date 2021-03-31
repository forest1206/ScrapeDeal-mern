import express from "express";

const router = express.Router();
import {
  getProducts,
  getAdminProducts,
  getProductSuggestions,
  getLatestProducts,
  getProductFilters,
  getProductById,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

import { protect, hasRole, ROLES } from "../middleware/authMiddleware.js";

router
  .route("/admin/")
  .get(protect, hasRole(ROLES.Merchant, ROLES.Admin), getAdminProducts)
  .post(protect, hasRole(ROLES.Merchant, ROLES.Admin), createProduct);

router
  .route("/admin/:id")
  .get(protect, hasRole(ROLES.Merchant, ROLES.Admin), getProductById)
  .delete(protect, hasRole(ROLES.Merchant, ROLES.Admin), deleteProduct)
  .put(protect, hasRole(ROLES.Merchant, ROLES.Admin), updateProduct);

router.route("/").get(getProducts);
router.route("/latest").get(getLatestProducts);
router.route("/suggestions").get(getProductSuggestions);
router.route("/filters").get(getProductFilters);
router.route("/:slug").get(getProductBySlug);

export default router;
