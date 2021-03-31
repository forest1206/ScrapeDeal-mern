import asyncHandler from "express-async-handler";
import { ROLES } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import User from "./../models/User.js";

const getDashboardData = asyncHandler(async (req, res) => {
  try {
    console.log("getDashboardData");
    const customers = await User.find({ role: ROLES.Customer });
    const products = await Product.find({});
    const sellers = await User.find({ role: ROLES.Merchant });
    console.log("customers", customers.length);
    res.json({
      countCustomer: customers.length,
      countSeller: sellers.length,
      countProduct: products.length,
    });
  } catch (e) {
    res.status(500);
  }
});

export { getDashboardData };
