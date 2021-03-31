import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Bid, { bidStatus } from "../models/Bid.js";
import Product from "../models/Product.js";
const ObjectId = mongoose.Types.ObjectId;

const getBidsByProductId = asyncHandler(async (req, res) => {
  const product = req.params.id;

  if (product) {
    const bids = await Bid.find({ product: product }).populate({
      path: "user",
      select: ["name", "email"],
    });
    res.json(bids);
  }

  const bids = await Bid.find();
  res.json(bids);
});

const getBidsByUserId = asyncHandler(async (req, res) => {
  const user = req.params.id;
  try {
    if (user) {
      let query = [
        {
          $match: {
            user: ObjectId(user),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "newproduct",
          },
        },
        {
          $unwind: "$newproduct",
        },
        {
          $lookup: {
            from: "categories",
            localField: "newproduct.category",
            foreignField: "_id",
            as: "newproduct.category",
          },
        },
        {
          $unwind: "$newproduct.category",
        },
        {
          $addFields: {
            userName: "$user.name",
            "product.name": "$newproduct.name",
            "product.slug": "$newproduct.slug",
            "product.category": "$newproduct.category.name",
          },
        },
        {
          $project: {
            user: 0,
            newproduct: 0,
          },
        },
      ];

      let bids = await Bid.aggregate(query);

      res.json(bids);
    }
  } catch (error) {
    res.json(error);
  }
});

const getBidById = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id);

  if (bid) {
    res.json(bid);
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

const getBidBySlug = asyncHandler(async (req, res) => {
  const bid = await Bid.findOne({ slug: req.params.slug });

  if (bid) {
    res.json(bid);
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

const createBid = asyncHandler(async (req, res) => {
  let { product, amount, description } = req.body;
  console.log("createBid", product, amount, description);

  try {
    const bid = new Bid({
      product,
      amount,
      description,
      status: bidStatus.pending,
      user: req.user,
    });
    const createdBid = await bid.save();
    res.status(201).json(createdBid);
  } catch {
    res.status(400);
  }
});

const updateBid = asyncHandler(async (req, res) => {
  let { amount, description } = req.body;

  const bid = await Bid.findById(req.params.id);

  if (bid) {
    bid.amount = amount;
    bid.description = description;
    const updatedBid = await bid.save();
    res.json(updatedBid);
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

const deleteBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id);

  if (bid) {
    await bid.remove();
    res.json({ id: bid._id, message: "Bid removed" });
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

const awardBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id);

  //   const bid = await Bid.findOne({ _id: req.params.id });
  console.log("awardBid", bid, req.params.id);
  if (bid) {
    bid.status = bidStatus.accepted;
    const updatedBid = await bid.save();
    res.json(updatedBid);
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

const cancelAward = asyncHandler(async (req, res) => {
  const bid = await Bid.findById(req.params.id);

  if (bid) {
    bid.status = bidStatus.pending;
    const updatedBid = await bid.save();
    res.json(updatedBid);
  } else {
    res.status(400);
    throw new Error("Bid not found");
  }
});

export {
  getBidsByProductId,
  getBidsByUserId,
  getBidById,
  getBidBySlug,
  deleteBid,
  createBid,
  updateBid,
  awardBid,
  cancelAward
};
