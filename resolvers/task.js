const User = require("../database/models/user");
const Task = require("../database/models/task");
const { isAuthenticated, isTaskOwner } = require("./middleware");
const { combineResolvers } = require("graphql-resolvers");
const { base64ToString, stringToBase64 } = require("../helper");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (parent, { cursor, limit = 10 }, ctx, info) => {
        try {
          const query = { user: ctx.loggedInUserId };
          if (cursor) {
            query["_id"] = {
              $lt: base64ToString(cursor),
            };
          }
          // Fetch an extra record for checking next page
          let tasks = await Task.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);
          const hasNextPage = tasks.length > limit;
          tasks = hasNextPage ? tasks.slice(0, -1) : tasks;
          return {
            taskFeed: tasks,
            pageInfo: {
              nextPageCursor: hasNextPage
                ? stringToBase64(tasks[tasks.length - 1].id)
                : null,
              hasNextPage,
            },
          };
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
