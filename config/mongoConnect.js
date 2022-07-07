const mongoose = require("mongoose");

mongoose.connect(
  `${process.env.MONGO_URI_CONNECT}`,
  () => console.log("Connected to DB")
);
