const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

module.exports.verifyUser = async (req) => {
  req.email = null;
  req.loggedInUserId = null;
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    try {
      const token = bearerHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.loggedInUserId = user.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
