const Audio = require("../../model/Audio");

module.exports = {
  viewAudio: async (req, res) => {
    try {
      const audio = await Audio.find().sort({ createdAt: -1 });
      res.status(200).json({
        status: "Success",
        data: audio,
      });
    } catch (error) {
      res.status(400).json({
        status: "Error",
        message: error.message,
      });
    }
  },
  addAudio: async (req, res) => {
    try {
      const { path, transcription } = req.body;
      const data = {
        path,
        transcription,
      };
      await Audio.create(data);
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
  editAudio: async (req, res) => {
    try {
      const { id } = req.params;
      const { path, transcription } = req.body;
      const data = {
        path,
        transcription,
        updatedAt: new Date(),
      };
      const audio = await Audio.findByIdAndUpdate(id, data);
      await audio.save();
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
  deleteAudio: async (req, res) => {
    try {
      const { id } = req.params;
      const audio = await Audio.findOne({ _id: id });
      await audio.deleteOne();
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
