const mongoose = require("mongoose");
const sysSchema=require("../models/InformationModel")
const logSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    default: Date.now,
  },
  appName: {
    type: String,
    required: true,
  },
  logLevel: {
    type: String,
    required: true,
  },
  logString: {
    type: String,
    required: true,
  },
  sysInfo: {
    type: sysSchema.InfoSchema,
    required: true,
  }
});

const logModel = mongoose.model("logModel", logSchema);

module.exports = logModel;