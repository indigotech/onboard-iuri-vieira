import { nanoid } from "nanoid";

const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: String
    name: String
    email: String
    birthDate: String
  }

  type Mutation {
    createUser(data: UserInput!): User
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
  },
  Mutation: {
    createUser: (
      _,
      { data: args }: { data: { name; email; password; birthDate; id } }
    ) => {
      const id = nanoid(5);
      args.id = id;
      return args;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4000).then(() => {
  console.log(`Running server at http://localhost:4000/`);
});
