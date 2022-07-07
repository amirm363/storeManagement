const mongoose = require("mongoose");
const userData = require("../models/dataSchema");

const saveData = async (data) => {
  console.log(await userData.insertMany(data));
};

module.exports = { saveData };
