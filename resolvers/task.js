const { tasks, users } = require("../constants");
const uuid = require("uuid");

module.exports = {
  Query: {
    tasks: () => tasks,
    task: (parent, args) => tasks.find((task) => task.id === args.id),
  },
  Mutation: {
    createTask: (parent, args) => {
      const { input } = args;
      const task = {
        id: uuid.v4(),
        name: input.name,
        completed: false,
        userId: input.userId,
      };
      tasks.push(task);
      return task;
    },
  },
  Task: {
    user: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.userId);
    },
  },
};
