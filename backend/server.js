import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors"; // console with colors
import morgan from "morgan";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import { ApolloServer, gql } from "apollo-server-express";
import http from "http";

import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import productRoutes from "./routes/productRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";

import typeDefs from "./schemas/index.js";
import resolvers from "./resolvers/index.js";

dotenv.config();
const port = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === "production";

async function startServer(typeDefs, resolvers) {
  connectDB();

  const app = express();

  if (!isProduction) {
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

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.use(notFound);
  app.use(errorHandler);
  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(`httpServer`, httpServer);
  console.log(
    `Graphql server ready http://localhost:${port}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Electronic Shop Server running in ${process.env.NODE_ENV} mode on port ${port}`
      .yellow.bold
  );
}

startServer(typeDefs, resolvers);
