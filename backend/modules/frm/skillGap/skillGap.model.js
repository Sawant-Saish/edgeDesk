const mongoose = require('mongoose');
const { createModelWrapper } = require('../../../modelFactory');

const SkillGapResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRoleId: { type: String, required: true },
  missingSkills: [{ type: String }],
  matchedSkills: [{ type: String }],
  matchPercentage: { type: Number, min: 0, max: 100 },
  explanationText: { type: String, maxlength: 400 },
  computedAt: { type: Date, default: Date.now },
});

const MongooseSkillGapResult = mongoose.model('SkillGapResult', SkillGapResultSchema);
module.exports = createModelWrapper('SkillGapResult', MongooseSkillGapResult);
