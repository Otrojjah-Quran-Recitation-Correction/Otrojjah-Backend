const Joi = require("joi");
const mongoose = require("mongoose");

const verseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ruleId: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true
  },
  surah: {
    type: String
  }
});

const Verse = mongoose.model("Verse", verseSchema);

function validateVerse(verse) {
  const schema = {
    name: Joi.string().required(),
    ruleId: Joi.objectId().required(),
    surah: Joi.string()
  };
  return Joi.validate(verse, schema);
}

exports.Verse = Verse;
exports.validateVerse = validateVerse;
