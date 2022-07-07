const express = require("express");
const cors = require("cors");
const mongoDataDal = require("./DALS/mongoDataDAL");
const dotenv = require('dotenv')
const app = express();

require("./config/mongoConnect");

app.use(express.json());
app.use(cors());
dotenv.config()

app.get("/", (req, res) => {
  res.type("text/plain");
  res.send("HELLO");
});
app.post("/api", async (req, res) => {
  let updatedData = req.body.map((item) => {
    console.log(typeof item);
    return {
      RowNumber: item.rowNumber,
      Name: item.name,
      CatalogNum: item.catalogNum,
      Description: item.description,
      ProductType: item.prodType,
      Date: item.date,
    };
  });
  let reactData = {
    tData: [...updatedData],
  };

  try {
    console.log(reactData);
    await mongoDataDal.saveData(reactData);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(400);
  }
});

app.listen(4000, () => console.log("Listening on port 4000"));
