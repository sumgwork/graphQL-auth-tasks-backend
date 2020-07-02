const { tasks, users } = require("../constants");

module.exports = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),
  },
  Mutation: {},
  User: {
    tasks: (parent, args) => tasks.filter((task) => task.userId === parent.id),
  },
};
