const auth = require("../middleware/auth");
const Joi = require("joi");
const _ = require("lodash");
const { Hokm, validateHokm } = require("../models/hokm");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allRecords = await Hokm.find({});
  res.send(allRecords);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const hokm = await Hokm.findById(id);
  if (!hokm) return res.status(400).send("There is no such record");

  res.send(hokm);
});

router.post("/", async (req, res) => {
  const { error } = validateHokm(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let hokm = await Hokm.findOne({ name: req.body.name });
  if (hokm) return res.status(400).send("Record is already registered.");

  hokm = new Hokm(_.pick(req.body, ["name", "details"]));
  await hokm.save();

  res.send(hokm);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const { error } = validateHokm(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const hokm = await Hokm.findById(id);
  if (!hokm) return res.status(400).send("There is no such record");

  const newHokm = await Hokm.findByIdAndUpdate(
    id,
    _.pick(req.body, ["name", "details"]),
    {
      new: true
    }
  );

  res.send(newHokm);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const hokm = await Hokm.findByIdAndRemove(id);
  if (!hokm) return res.status(400).send("There is no such record");

  res.send(hokm);
});

module.exports = router;
