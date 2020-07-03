const User = require("../database/models/user");

/**
 * Implementing batch user fetch with DataLoaders
 */
module.exports.batchUsers = async (userIds) => {
  console.log("keys====", userIds);
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map((userId) => users.find((user) => user.id === userId));
};
