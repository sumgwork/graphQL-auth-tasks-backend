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

  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  extend type Mutation {
    signup(input: SignupInput): User
  }
`;
