const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { validateRecord, getRecord, createRecord } = require("../models/record");

router.get("/", async (req, res) => {
  const records = await getRecord(req.query);
  res.send(records);
});

router.post("/", async (req, res) => {
  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const record = await createRecord(req.body);
  res.send(record);
});

module.exports = router;
