const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { validateRecord, getRecord, createRecord } = require("../models/record");

router.get("/", async (req, res) => {
  const records = await getRecord(req.query);
  res.send(records);
});


module.exports = router;
