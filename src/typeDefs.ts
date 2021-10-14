const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      birthDate: String!
    ): UserInput
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
