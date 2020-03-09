const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { Rule, getRuleChildren, validateRule } = require("../models/rule");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (id) {
    const { error } = Joi.validate({ id }, { id: Joi.objectId() });
    if (error) return res.status(400).send(error.details[0].message);
  }

  const rules = await getRuleChildren(id);
  if (!rules) return res.status(400).send("There is no children of this rule.");

  res.send(rules);
});

router.post("/", async (req, res) => {
  const { error } = validateRule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let rule = await Rule.findOne({ name: req.body.name });
  if (rule) return res.status(400).send("Rule is already exists.");

  const rootRule = await getRuleChildren();
  if (rootRule && !rule.parentId)
    return res.status(400).send("There is already root rule.");

  rule = new Rule(_.pick(req.body, ["name", "description", "parentId"]));
  await rule.save();

  res.send(rule);
});

// router.put("/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
//   if (idError) return res.status(400).send(idError.details[0].message);

//   const { error } = validateHokm(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const hokm = await Hokm.findById(id);
//   if (!hokm) return res.status(400).send("There is no such record");

//   const newHokm = await Hokm.findByIdAndUpdate(
//     id,
//     _.pick(req.body, ["name", "details"]),
//     {
//       new: true
//     }
//   );

//   res.send(newHokm);
// });

// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error: idError } = Joi.validate({ id }, { id: Joi.objectId() });
//   if (idError) return res.status(400).send(idError.details[0].message);

//   const hokm = await Hokm.findByIdAndRemove(id);
//   if (!hokm) return res.status(400).send("There is no such record");

//   res.send(hokm);
// });

module.exports = router;
