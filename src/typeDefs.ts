const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
    getUser(id: Int!): User
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
    id: Int!
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }
`;

export default typeDefs;
