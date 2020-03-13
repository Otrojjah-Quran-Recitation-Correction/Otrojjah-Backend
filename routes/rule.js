const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { Rule, getRuleChildren, validateRule } = require("../models/rule");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const adminAuth = [auth, require("../middleware/admin")];

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

router.post("/", adminAuth, async (req, res) => {
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

router.put("/:id", adminAuth, validateObjectId, async (req, res) => {
  const { error } = validateRule(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.parentId)
    return res.status(400).send("ParentId can't be modified.");

  const Rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!Rule) return res.status(400).send("There is no such rule");

  res.send(Rule);
});

module.exports = router;
