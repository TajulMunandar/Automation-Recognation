const User = require("../../model/User");
const History = require("../../model/History");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const days = [];
      for (let i = 0; i <= 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        days.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
      }

      const dailyCounts = await Promise.all(
        days.map(async (day) => {
          const count = await History.countDocuments({
            createdAt: {
              $gte: new Date(day),
              $lt: new Date(new Date(day).getTime() + 24 * 60 * 60 * 1000),
            },
          });
          return count;
        })
      );

      res.status(200).json({
        status: "Success",
        valid: true,
        dailyCounts,
        days,
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
