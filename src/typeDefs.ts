const { gql } = require("apollo-server");

export const typeDefs = gql`
  type Query {
    hello: String!
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(data: UserInput!): User
    login(data: LoginInput!): Login
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  type User {
    id: Int!
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type Login {
    user: User
    token: String
  }
`;

export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
