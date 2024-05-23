const User = require("../../model/User");

module.exports = {
  viewUser: async (req, res) => {
    try {
      const user = await User.find().sort({ createdAt: -1 });
      res.status(200).json({
        status: "Success",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
  addUser: async (req, res) => {
    try {
      const { name, username, password, isAdmin } = req.body;
      const data = {
        name,
        username,
        password,
        isAdmin,
      };
      await User.create(data);
      res.status(200).json({
        status: "Success Add",
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, username, isAdmin } = req.body;
      const data = {
        name,
        username,
        isAdmin,
        updatedAt: new Date(),
      };
      const user = await User.findByIdAndUpdate(id, data);
      await user.save();
      res.status(200).json({
        status: "Success Edit",
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findOne({ _id: id });
      await user.deleteOne();
      res.status(200).json({
        status: "Success Edit",
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
};
