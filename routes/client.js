const auth = require("../middleware/auth");
const Joi = require("joi");
const _ = require("lodash");
const { Client, validate } = require("../models/client");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allRecords = await Client.find({});
  res.send(allRecords);
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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let client = await Client.findOne({ recordName: req.body.recordName });
  if (client) return res.status(400).send("Record is already registered.");

  client = new Client(_.pick(req.body, ["recordName", "ayah", "hokm", "link"]));
  await client.save();

  res.send(client);
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

module.exports = router;
