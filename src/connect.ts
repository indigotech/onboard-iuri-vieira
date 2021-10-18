import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const startServer = async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
    });
    connection.synchronize();

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    var listenServer = await app.listen({ port: process.env.PORT });

    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}/graphql`
    );

    return listenServer;
  } catch (error) {
    console.log(error);
    console.log("An error occured, try again later");
  }
};

export default startServer;
