const bcrypt = require("bcryptjs");
const User = require("../database/models/user");
const Task = require("../database/models/task");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./middleware");

module.exports = {
  Query: {
    currentUser: combineResolvers(
      isAuthenticated,
      async (parent, args, context) => {
        try {
          const user = await User.findById(context.loggedInUserId);
          if (!user) {
            throw new Error("User not found!");
          }
          return user;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
  },
  Mutation: {
    signup: async (parent, args) => {
      const { input } = args;
      try {
        //check if existing user
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error("Email already in use");
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);

        const newUser = new User({
          name: input.name,
          email: input.email,
          password: hashedPassword,
        });

        const result = await newUser.save();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    login: async (parent, args, context, info) => {
      const { input } = args;
      try {
        // Check if user exists
        const existingUser = await User.findOne({ email: input.email });
        if (!existingUser) {
          throw new Error("Invalid credentials!");
        }
        // match password
        const match = await bcrypt.compare(
          input.password,
          existingUser.password
        );
        if (!match) {
          throw new Error("Invalid credentials!");
        }
        const token = jwt.sign(
          {
            email: existingUser.email,
            name: existingUser.name,
          },
          process.env.JWT_SECRET_KEY || "mysecretkey",
          {
            expiresIn: "1d",
          }
        );
        return { token };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  User: {
    tasks: async (parent, args) => {
      try {
        const tasks = await Task.find({ user: parent.id });
        return tasks;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};
