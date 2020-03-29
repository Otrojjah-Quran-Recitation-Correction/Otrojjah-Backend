const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  Record,
  validateRecord,
  getRecord,
  createRecord,
  labelRecord,
  deleteRecord,
  getRandomRecord
} = require("../models/record");
const validateObjectId = require("../middleware/validateObjectId");
const uploadFiles = require("../middleware/uploadFiles");
const renameFiles = require("../middleware/renameFiles");
const auth = require("../middleware/auth");
const adminAuth = [auth, require("../middleware/admin")];
const shaikhAuth = [auth, require("../middleware/shaikh")];

router.get("/", async (req, res) => {
  const records = await getRecord(req.query);
  res.send(records);
});

router.get("/random/:type", async (req, res) => {
  const records = await getRandomRecord(req.params.type);
  res.send(records);
});

router.post("/", [uploadFiles, renameFiles], async (req, res) => {
  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.files.forEach(async file => {
    await createRecord(req.body, file);
  });

  res.send(`${req.files.length} records added.`);
});

router.put("/:id", [adminAuth, validateObjectId], async (req, res) => {
  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const record = await Record.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["label", "verseId"]),
    {
      new: true
    }
  );
  if (!record) return res.status(400).send("There is no such record");

  res.send(record);
});

router.put("/label/:id", [shaikhAuth, validateObjectId], async (req, res) => {
  const record = await labelRecord(req.params.id, req.body.label, req.user);
  if (!record) return res.status(400).send("Record is not found.");

  res.send(record);
});

router.delete("/", adminAuth, async (req, res) => {
  const result = await deleteRecord(req.query);
  res.send(result);
});

module.exports = router;
