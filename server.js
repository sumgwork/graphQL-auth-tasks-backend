const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");

// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser
app.use(express.json());

const typeDefs = gql`
  type Query {
    greetings: String
  }
`;

const resolvers = {};

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
