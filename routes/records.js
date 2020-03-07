const express = require("express");
const router = express.Router();
const { Client } = require("../models/client");
const { Shaikh } = require("../models/shaikh");

router.get("/", async (req, res) => {
  const { type, label } = req.query;
  if (!type) {
    const clientRecords = await Client.find({}).select("link");
    const shaikhRecords = await Shaikh.find({}).select("link");
    const allRecords = [...clientRecords, ...shaikhRecords];
    return res.send(allRecords);
  } else if (type === "shaikh") {
    const shaikhRecords = await Shaikh.find({}).select("link");
    return res.send(shaikhRecords);
  } else if (type === "client") {
    const clientRecords = await Client.find({ correct: label }).select("link");
    return res.send(clientRecords);
  } else return res.status(400).send("Invalid type.");
});

module.exports = router;
