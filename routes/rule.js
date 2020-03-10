const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { Rule, getRuleChildren, validateRule } = require("../models/rule");

router.get("/", async (req, res) => {
  const rules = await getRuleChildren();
  if (!rules) return res.status(400).send("There is no root rule.");
  res.send(rules);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const rules = await getRuleChildren(id);
  if (!rules) return res.status(400).send("There is no children of this rule.");

  res.send(rules);
});

router.post("/", async (req, res) => {
  const { error } = validateRule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let rule = await Rule.findOne({
    name: req.body.name,
    parentId: req.body.parentId
  });
  if (rule) return res.status(400).send("Rule is already exists.");

  if (!req.body.parentId) {
    const rootRule = await getRuleChildren();
    if (rootRule) return res.status(400).send("There is already root rule.");
  }

  rule = new Rule(req.body);
  await rule.save();

  res.send(rule);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = validateRule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.parentId)
    return res.status(400).send("ParentId can't be modified.");

  const Rule = await Rule.findById(id);
  if (!Rule) return res.status(400).send("There is no such rule");

  const newRule = await Rule.findByIdAndUpdate(id, req.body, {
    new: true
  });

  res.send(newRule);
});

module.exports = router;
