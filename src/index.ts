import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

const startServer = async () => {
  try {
    const server = new ApolloServer({ typeDefs, resolvers });

    await createConnection();

    const app = express();

    await server.start();

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.log(error);
    console.log("An error occured, try again later");
  }
};

startServer();
