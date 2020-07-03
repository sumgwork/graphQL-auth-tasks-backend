const { tasks, users } = require("../constants");
const User = require("../database/models/user");
const Task = require("../database/models/task");
const { isAuthenticated, isTaskOwner } = require("./middleware");
const { combineResolvers } = require("graphql-resolvers");
const { findById } = require("../database/models/user");

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
      async (parent, { id }) => {
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
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, args) => {
        const { name, completed } = args.input;
        try {
          const task = await Task.findByIdAndUpdate(
            args.id,
            { name, completed },
            { new: true }
          );
          return task;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id }, { loggedInUserId }) => {
        try {
          const task = await Task.findByIdAndDelete(id);
          await User.updateOne(
            { _id: loggedInUserId },
            { $pull: { tasks: task.id } }
          );
          return task;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    ),
  },
  Task: {
    user: async (parent) => {
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
