const mongoose = require('mongoose');

const SkillProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceType: { type: String, enum: ['pdf', 'pasted_text'], required: true },
  rawTextHash: { type: String, required: true },
  extractedSkills: [
    {
      skillId: { type: String, required: true },
      confidence: { type: Number, min: 0, max: 1 },
      evidenceSnippet: { type: String, maxlength: 200 },
    },
  ],
  yearsExperience: { type: Number, default: 0 },
  extractionModel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SkillProfile', SkillProfileSchema);
