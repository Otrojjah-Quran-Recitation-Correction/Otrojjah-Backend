const Joi = require("joi");
const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Rule = mongoose.model("Rule", ruleSchema);

function validateRule(rule) {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    parentId: Joi.ObjectId().required()
  };
  return Joi.validate(rule, schema);
}

async function getRuleChildren(id) {
  return await Rule.find({ parentId: id });
}

exports.Rule = Rule;
exports.getRuleChildren = getRuleChildren;
exports.validateRule = validateRule;
