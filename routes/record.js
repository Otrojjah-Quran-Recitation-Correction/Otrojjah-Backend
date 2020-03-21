const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  validateRecord,
  getRecord,
  createRecord,
  labelRecord
} = require("../models/record");
const validateObjectId = require("../middleware/validateObjectId");
const uploadFile = require("../middleware/uploadFile");
const auth = require("../middleware/auth");
const shaikhAuth = [auth, require("../middleware/shaikh")];

router.get("/", async (req, res) => {
  const records = await getRecord(req.query);
  res.send(records);
});

router.post("/", uploadFile, async (req, res) => {
  console.log(req.file);

  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const record = await createRecord(req.body);
  res.send(record);
});

router.put("/label/:id", [shaikhAuth, validateObjectId], async (req, res) => {
  const record = await labelRecord(req.params.id, req.body.label, req.user);
  if (!record) return res.status(400).send("Record is not found.");

  res.send(record);
});

module.exports = router;
