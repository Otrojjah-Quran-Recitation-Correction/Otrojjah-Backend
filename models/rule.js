const Joi = require("joi");
const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String
  }
});

const Rule = mongoose.model("Rule", ruleSchema);

function validateRule(rule) {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string(),
    parentId: Joi.objectId().required()
  };
  return Joi.validate(rule, schema);
}

async function getRuleChildren(id) {
  return await Rule.find({ parentId: id }).select("-__v");
}

async function getRule(query) {
  const filter = {};
  if (query.id) filter._id = query.id;
  if (query.parentId) filter.parentId = query.parentId;
  if (query.name) filter.name = query.name;
  

  return await Rule.find(filter).select("-__v");
}

exports.Rule = Rule;
exports.getRule = getRule;
exports.validateRule = validateRule;
