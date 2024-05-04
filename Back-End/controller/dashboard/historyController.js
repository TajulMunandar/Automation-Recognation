const History = require("../../model/History");

module.exports = {
  viewHistory: async (req, res) => {
    try {
      const history = await History.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "id_user",
          select: "name",
        })
        .populate({
          path: "id_audio",
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
      const { id_user, id_audio, recognized_text } = req.body;
      const data = {
        id_user,
        id_audio,
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
  editHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { id_user, id_audio, recognized_text } = req.body;
      const data = {
        id_user,
        id_audio,
        recognized_text,
        updatedAt: new Date(),
      };
      const history = await History.findByIdAndUpdate(id, data);
      await history.save();
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
  deleteHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const history = await History.findOne({ _id: id });
      await history.deleteOne();
      res.status(200).json({
        status: "Success Delete",
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
};
