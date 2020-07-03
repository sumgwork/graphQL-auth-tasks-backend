const { skip } = require("graphql-resolvers");
const Task = require("../../database/models/task");
const { isValidObjectId } = require("../../database/util");

module.exports.isAuthenticated = (parent, args, context) => {
  const email = context.email;
  if (!email) {
    throw new Error("Access Denied! Please login to continue.");
  }
  return skip;
};

module.exports.isTaskOwner = async (parent, { id }, { loggedInUserId }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid task id");
    }
    const task = await Task.findById(id);
    if (!task) {
      throw new Error("Task not found");
    } else if (task.user.toString() !== loggedInUserId) {
      throw new Error("Not authorised as task owner");
    }
    return skip;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
