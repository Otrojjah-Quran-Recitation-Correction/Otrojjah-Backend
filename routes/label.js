const auth = require("../middleware/auth");
const shaikh = require("../middleware/shaikh");
const Joi = require("joi");
const _ = require("lodash");
const { Client } = require("../models/client");
const express = require("express");
const router = express.Router();

//todo: to be authorized as a shaikh
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  //todo validate (correct)
  const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
  if (idError) return res.status(400).send(idError.details[0].message);

  const client = await Client.findById(id);
  if (!client) return res.status(400).send("There is no such record");

  const newClient = await Client.findByIdAndUpdate(
    id,
    _.pick(req.body, ["correct"]),
    {
      new: true
    }
  );

  res.send(newClient);
});

module.exports = router;
