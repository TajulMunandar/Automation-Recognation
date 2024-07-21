const History = require("../../model/History");


module.exports = {
  viewHistory: async (req, res) => {
    try {
      
      const history = await History.find().sort({ createdAt: -1 }).populate({
        path: "id_user",
        select: "name",
      });
      res.status(200).json({
        status: "Success",
        data: history,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
  addHistory: async (req, res) => {
    try {
      const { id_user, recognized_text } = req.body;
      const data = {
        id_user,
        recognized_text,
      };
      await History.create(data);
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
};
