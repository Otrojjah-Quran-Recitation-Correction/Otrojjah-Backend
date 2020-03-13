const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { Verse, validateVerse, getVerses } = require("../models/verse");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const adminAuth = [auth, require("../middleware/admin")];

router.get("/", async (req, res) => {
  const verses = await getVerses(req.query);
  res.send(verses);
});

router.post("/", adminAuth, async (req, res) => {
  const { error } = validateVerse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let verse = await Verse.findOne({ name: req.body.name });
  if (verse) return res.status(400).send("Verse is already exists.");

  verse = new Verse(req.body);
  await verse.save();

  res.send(verse);
});

router.put("/:id", [adminAuth, validateObjectId], async (req, res) => {
  const { error } = validateVerse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const verse = await Verse.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!verse) return res.status(400).send("Verse is not found.");

  res.send(verse);
});

router.delete("/:id", [adminAuth, validateObjectId], async (req, res) => {
  const verse = await Verse.findByIdAndRemove(req.params.id);

  if (!verse) return res.status(404).send("Verse is not found.");

  res.send(verse);
});

module.exports = router;
