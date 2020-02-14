const Joi = require("joi");
const mongoose = require("mongoose");

const hokmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  details: {
    type: String,
    required: true
  }
});

const Hokm = mongoose.model("Hokm", hokmSchema);

function validateHokm(hokm) {
  const schema = {
    hokm: Joi.string().required(),
    details: Joi.string().required()
  };
  return Joi.validate(hokm, schema);
}

exports.Hokm = Hokm;
exports.validateHokm = validateHokm;
