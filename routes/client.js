const authorizeAndUpload = require("../uploadAndDownload/upload");
const auth = require("../middleware/auth");
const Joi = require("joi");
const _ = require("lodash");
const { Client, validate } = require("../models/client");
const express = require("express");
const router = express.Router();
const util = require("util");
const fs = require("fs");
const randomInt = require("random-int");

router.get("/", async (req, res) => {
  const allRecords = await Client.find({});
  res.send(allRecords);
});

router.get("/random", async (req, res) => {
  const allNegRecords = await Client.find({ correct: undefined });
  randomNum = randomInt(0, allNegRecords.length - 1);
  res.send(allNegRecords[randomNum]);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const client = await Client.findById(id);
  if (!client) return res.status(400).send("There is no such record");

  res.send(client);
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.file == undefined) {
      res.send("Please upload a file");
    }

    let client = await Client.findOne({ recordName: req.body.recordName });
    if (client) return res.status(400).send("Record is already registered.");

    authorizeAndUpload(req.file, async id => {
      const link = `https://drive.google.com/uc?export=download&id=${id}`;
      client = new Client({
        recordName: req.file.filename,
        ayah: req.body.ayah,
        hokm: req.body.hokm,
        link: link
      });
      console.log(client);
      await client.save();
    });
  } catch (err) {
    console.log(err);
    if (err) {
      res.send(err);
    }
  }
  return res.send(req.file);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const client = await Client.findById(id);
  if (!client) return res.status(400).send("There is no such record");

  const newClient = await Client.findByIdAndUpdate(
    id,
    _.pick(req.body, ["recordName", "ayah", "hokm", "link"]),
    {
      new: true
    }
  );

  res.send(newClient);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const client = await Client.findByIdAndRemove(id);
  if (!client) return res.status(400).send("There is no such record");

  res.send(client);
});

async function startUpload(req, res) {}

module.exports = router;
