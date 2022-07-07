const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://pzproject:q1w2e3@cluster0.pjjinpd.mongodb.net/?retryWrites=true&w=majority",
  () => console.log("Connected to DB")
);
