import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors"; // console with colors
import morgan from "morgan";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());
app.use("/api/product", productRoutes);
app.use("/api/bid", bidRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("API is running....");
});

const PORT = process.env.PORT || 5000;

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => "Hello world!" };

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use(notFound);
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `Electronic Shop Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .yellow.bold
  )
);

// import { ApolloServer, gql } from "apollo-server";

// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin",
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster",
//   },
// ];
// const typeDefs = gql`
//   type Book {
//     title: String
//     author: String
//   }
//   type Query {
//     books: [Book]
//   }
// `;
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });

// // The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
