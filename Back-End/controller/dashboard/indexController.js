const User = require("../../model/user");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.status(200).json({
        status: "Success",
        valid: true,
        userCount: userCount,
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
