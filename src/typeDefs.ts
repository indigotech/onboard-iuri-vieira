const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
    getUser(email: String!): User
  }

  type Mutation {
    createUser(data: UserInput!): User
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: String!
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }
`;

export default typeDefs;
