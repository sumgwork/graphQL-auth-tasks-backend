const bcrypt = require("bcryptjs");
const { tasks, users } = require("../constants");
const User = require("../database/models/user");

module.exports = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),
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
  },
  User: {
    tasks: (parent, args) => tasks.filter((task) => task.userId === parent.id),
  },
};
