const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const resolvers = require("./resolvers");
const typeDefs = require("./schema");
const { connection } = require("./database/util");

// set env variables
dotEnv.config();

const app = express();

// MongoDB
connection();

// cors
app.use(cors());

// body parser
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs, // schema
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
