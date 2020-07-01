const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const { tasks, users } = require("./constants");

// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser
app.use(express.json());

const typeDefs = gql`
  type Query {
    greetings: String!
    tasks: [Task!]
  }

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
`;

const resolvers = {
  Query: {
    greetings: () => "Hello",
    tasks: () => tasks,
  },
  Task: {
    user: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.userId);
    },
  },
};

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
