const mongoose = require("mongoose");

const userData = mongoose.Schema({
  tData: [Object],
});

module.exports = mongoose.model("pzData", userData);
