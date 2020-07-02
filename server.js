const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const resolvers = require("./resolvers");

// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser
app.use(express.json());

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }

  input CreateTaskInput {
    name: String!
    userId: ID!
  }

  type Query {
    greetings: String!
    tasks: [Task!]
    task(id: ID!): Task
    users: [User!]
    user(id: ID!): User
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task
  }
`;

// const resolvers = resolvers;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

apolloServer.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 3000;

app.use("/", (req, res, next) => {
  res.send({ message: "hello!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
  console.log(`GraphQL Endpoint: ${apolloServer.graphqlPath}`);
});
