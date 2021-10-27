const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  cpUsage: {
    type: Number,
    required: true,
  },
  memoryUsage: {
    type: {},
    required: true,
  },
  networkUsage: {
    type: [{}],
    required: true,
  },
});

const Info = mongoose.model("Info", InfoSchema);

module.exports = Info;
module.exports.InfoSchema=InfoSchema;