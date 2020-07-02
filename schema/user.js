const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }

  type Token {
    token: String!
  }

  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    signup(input: SignupInput): User
    login(input: LoginInput): Token
    # Login is defined as a mutation here because mutations are executed sequentially
  }
`;
