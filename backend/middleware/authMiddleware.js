import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const ROLES = {
  Admin: "ROLE_ADMIN",
  Customer: "ROLE_MEMBER",
  Merchant: "ROLE_MERCHANT",
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded", decoded);
      req.user = await User.findById(decoded.id).select("-password");
      // const userId = new ObjectId(decoded.id);
      // req.user = await User.findOne({ _id: userId }).select("-password");
      // console.log("protect", req.user);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const hasRole = (...roles) => (req, res, next) => {
  console.log("hasRole", req.user);
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  const hasRole = roles.find((role) => req.user.role === role);

  if (!hasRole) {
    return res.status(403).send("You are not allowed to make this request.");
  }

  return next();
};

const isMerchant = (req, res, next) => {
  if (!req.user.role === ROLES.Merchant) {
    return res.status(403).send("You are not allowed to make this request.");
  }
  return next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.role === ROLES.Admin) {
    return res.status(403).send("You are not allowed to make this request.");
  }
  return next();
};

const isOwner = (productId) => (req, res, next) => {
  // const product= await Product.findById(productId)
  if (req.user.role === ROLES.Merchant) {
    next();
  } else {
    return res.status(403).send("You are not product owner.");
  }
};

export { ROLES, protect, hasRole, isMerchant, isAdmin, isOwner };
