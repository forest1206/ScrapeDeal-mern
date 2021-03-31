import bcrypt from "bcryptjs";
import { ROLES } from "../middleware/authMiddleware.js";

const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Admin,
    status: "ALLOWED"
  },
  {
    name: "Seller1",
    email: "seller1@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Merchant,
    status: "ALLOWED"
  },
  {
    name: "Seller2",
    email: "seller2@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Merchant,
    status: "ALLOWED"
  },
  {
    name: "Jhon Doe",
    email: "jhon@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Customer,
    status: "ALLOWED"
  },
  {
    name: "Jane Doe",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Customer,
    status: "ALLOWED"
  },
  {
    name: "Customer",
    email: "customer@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: ROLES.Customer,
    status: "ALLOWED"
  },
];

export default users;
