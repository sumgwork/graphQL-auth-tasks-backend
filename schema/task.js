const { gql } = require("apollo-server-express");

module.exports = gql`
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
    createdAt: Date!
    updatedAt: Date!
  }

  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean
  }

  type TaskFeed {
    taskFeed: [Task!]
    pageInfo: PageInfo!
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
    tasks(cursor: String, limit: Int): TaskFeed
    task(id: ID!): Task
  }
`;
