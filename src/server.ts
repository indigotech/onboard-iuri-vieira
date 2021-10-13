import { nanoid } from "nanoid";

const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type UserInput {
    id: String!
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      birthDate: String!
    ): UserInput
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
  },
  Mutation: {
    createUser: (_: string, { name, email, password, birthDate }) => {
      const id = nanoid(5);
      const user = { name, email, password, birthDate, id };
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(() => {
  console.log(`Running server at http://localhost:4000/`);
});
