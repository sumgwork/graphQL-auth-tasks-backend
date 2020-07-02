const { gql } = require("apollo-server-express");

const userSchema = require("./user");
const taskSchema = require("./task");

const typeDefs = gql`
  type Query {
    _: String #placeholder
  }

  type Mutation {
    _: String
  }
`;

module.exports = [typeDefs, userSchema, taskSchema];
