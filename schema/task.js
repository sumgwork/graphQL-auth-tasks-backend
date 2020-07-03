const { gql } = require("apollo-server-express");

module.exports = gql`
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }

  input CreateTaskInput {
    name: String!
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task
  }

  extend type Query {
    tasks: [Task!]
    task(id: ID!): Task
  }
`;
