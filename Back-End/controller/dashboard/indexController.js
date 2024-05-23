const User = require("../../model/User");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.status(200).json({
        status: "Success",
        valid: true,
        userCount: userCount,
        username: req.username,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        valid: false,
        message: error.message,
      });
    }
  },
};
