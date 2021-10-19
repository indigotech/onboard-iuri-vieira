import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import startServer from "./connect";

dotenv.config();
startServer();
