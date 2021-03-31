import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ROLES } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Bid from "../models/Bid.js";
import jwt from "jsonwebtoken";

const ObjectId = mongoose.Types.ObjectId;

const getProducts = asyncHandler(async (req, res) => {
  let token,
    user,
    query = {},
    matchQuery = [];

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findOne({ _id: ObjectId(decoded.id) }).select(
      "-password"
    );

    // if (user.role === ROLES.Merchant) {
    //   matchQuery.push({ user: { $ne: user._id } });
    // }
  }

  if (req.query.filter_category) {
    let categorySlugs = req.query.filter_category.split(",");
    if (categorySlugs.length > 0) {
      const categories = await Category.find({ slug: { $in: categorySlugs } });
      // res.json(categories.map((category) => category._id));
      let categoryIds = categories.map((category) => category._id);

      if (user.role === ROLES.Merchant) {
        query = {
          user: { $ne: user._id },
          category: { $in: categoryIds },
        };
      } else {
        query = { category: { $in: categoryIds } };
      }
      // matchQuery.push({
      //   category: { $in: categoryIds },
      // });
    }
  }

  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(limit)
    .skip(limit * (page - 1));

  const from = limit * (page - 1) + 1;
  const to = from + limit - 1 < total ? from + limit - 1 : total;
  const sort = "default";

  res.json({
    items: products,
    page,
    pages: Math.ceil(total / limit),
    from,
    to,
    total,
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  let matchQuery = {};

  try {
    if (req.user.role === ROLES.Merchant) {
      matchQuery = {
        user: req.user._id,
      };
    }

    const categories = await Category.find({});

    let total = 0,
      products = [];

    total = await Product.countDocuments(matchQuery);
    products = await Product.find(matchQuery)
      .limit(limit)
      .skip(limit * (page - 1))
      .populate({
        path: "category",
        select: "name",
      });

    const from = limit * (page - 1) + 1;
    const to = from + limit - 1 < total ? from + limit - 1 : total;
    const sort = "default";

    res.json({
      items: products,
      page,
      pages: Math.ceil(total / limit),
      from,
      to,
      total,
    });
  } catch (error) {
    res.json(error);
  }
});

const getLatestProducts = asyncHandler(async (req, res) => {
  // const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
  try {
    let query = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "newcategory",
        },
      },
      {
        $unwind: "$newcategory",
      },
      {
        $addFields: {
          category: "$newcategory.name",
        },
      },
      {
        $project: {
          user: 0,
          newcategory: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    let products = await Product.aggregate(query);
    res.json(products);
  } catch (error) {
    res.json(error);
  }
});

const getProductSuggestions = asyncHandler(async (req, res) => {
  const { query } = req.query;
  console.log("req.query", query);

  if (query) {
    const products = await Product
      // .find({"name": {$regex: `.*${query}.*`},});
      //   .find({ name: { $regex: query, $options: "i" } })
      .find({ name: new RegExp("^" + query.toLowerCase(), "i") })
      .limit(10);

    // .find({...keyword});
    // const array = await Promise.all(products.map(async (product) => {
    //     const productCategory = await Category.findById(product.category)
    //     product.category=productCategory.name
    //     return product
    // }));

    res.json(products);
  }

  const products = await Product.find();
  res.json(products);
});

const getProductFilters = asyncHandler(async (req, res) => {
  const product = await Product.find().sort({ price: 1 }).limit(1);

  const categories = await Category.find({});
  let query = [
    {
      $group: {
        _id: null,
        max: { $max: "$price" },
        min: { $min: "$price" },
      },
    },
  ];
  const result = await Product.aggregate(query);
  const { max, min } = result[0];
  const filters = [
    {
      items: categories.map((item, index) => ({
        id: index + 1,
        name: item.name,
        slug: item.slug,
      })),
      type: "check",
      name: "Categories",
      slug: "category",
      value: [],
    },
    {
      max,
      min,
      name: "Price",
      slug: "price",
      type: "range",
      value: [0, max],
    },
  ];
  res.json(filters);
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    let product;
    if (!mongoose.isValidObjectId(req.params.id)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    res.json(product);
  } catch (error) {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  let { name, price, description, images, category } = req.body;

  if (!mongoose.isValidObjectId(category)) {
    const obj = await Category.findOne({ name: category });
    category = obj._id;
  }

  const product = new Product({
    name,
    price,
    description,
    images,
    category,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  let { name, price, description, images, category } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.category = category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ id: product._id, message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
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
};
