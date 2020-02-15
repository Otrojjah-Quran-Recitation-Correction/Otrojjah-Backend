const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Shaikh, validateShaikh } = require("../models/shaikh");

router.get("/", async (req, res) => {
  const allRecords = await Shaikh.find({});
  res.send(allRecords);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const shaikh = await Shaikh.findById(id);
  if (!shaikh) return res.status(400).send("There is no such record");

  res.send(shaikh);
});

router.post("/", async (req, res) => {
  const { error } = validateShaikh(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shaikh = await Shaikh.findOne({ shaikhName: req.body.shaikhName });
  if (shaikh) return res.status(400).send("Record is already registered.");

  shaikh = new Shaikh(_.pick(req.body, ["shaikhName", "ayah", "hokm", "link"]));
  await shaikh.save();

  res.send(shaikh);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const { error } = validateShaikh(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const shaikh = await Shaikh.findById(id);
  if (!shaikh) return res.status(400).send("There is no such record");

  const newShaikh = await Shaikh.findByIdAndUpdate(
    id,
    _.pick(req.body, ["shaikhName", "ayah", "hokm", "link"]),
    {
      new: true
    }
  );

  res.send(newShaikh);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const shaikh = await Shaikh.findByIdAndRemove(id);
  if (!shaikh) return res.status(400).send("There is no such record");

  res.send(shaikh);
});

module.exports = router;
