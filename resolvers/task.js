const { tasks, users } = require("../constants");
const User = require("../database/models/user");
const Task = require("../database/models/task");
const { isAuthenticated, isTaskOwner } = require("./middleware");
const { combineResolvers } = require("graphql-resolvers");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (parent, args, ctx, info) => {
        try {
          const tasks = await Task.find({ user: ctx.loggedInUserId });
          return tasks;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id }, { loggedInUserId }) => {
        try {
          const task = await Task.findById(id);
          return task;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (parent, args, context) => {
        try {
          const { loggedInUserId } = context;
          const user = await User.findById(loggedInUserId);
          if (!user) {
            throw new Error("User not found");
          }
          const { input } = args;
          const task = new Task({
            name: input.name,
            completed: false,
            user: loggedInUserId,
          });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return task;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
  },
  Task: {
    user: async (parent, args, context, info) => {
      try {
        const user = await User.findById(parent.user);
        if (!user) {
          throw new Error("User does not exist!");
        }
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};
