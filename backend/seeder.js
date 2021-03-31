import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import bids from "./data/bids.js";
import categories from "./data/categories.js";
import User from "./models/User.js";
import Bid from "./models/Bid.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    await Bid.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdCategories = await Category.insertMany(categories);
    const adminUser = createdUsers[0]._id;
    const merchantUsers = [createdUsers[1], createdUsers[2]];
    const customerUsers = [createdUsers[3], createdUsers[4]];

    const sampleProducts = products.map((product, index) => {
      const productCategory = createdCategories.find(
        (item) => item.name === product.category
      );
      return {
        ...product,
        category: productCategory._id,
        user: merchantUsers[index % 2]._id,
      };
    });

    const createdProducts = await Product.insertMany(sampleProducts);
    const bidsData = [];

    createdProducts.map((product) => {
      bids.map((item, index) => {
        let bid = new Bid({
          product: product._id,
          amount: item.amount,
          description: item.description,
          user: customerUsers[index]._id,
        });
        bidsData.push(bid);
      });
    });
    const createdBids = await Bid.insertMany(bidsData);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
