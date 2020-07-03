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

  input UpdateTaskInput {
    name: String
    completed: Boolean
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Task
  }

  extend type Query {
    tasks: [Task!]
    task(id: ID!): Task
  }
`;
