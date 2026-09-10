const mongoose = require('mongoose');

const NegotiationSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  briefId: { type: String, required: true },
  skillProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillProfile' },
  clientPersona: {
    name: String,
    budgetRangeUSD: { min: Number, max: Number },
    difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'] },
    objectionStyle: {
      type: String,
      enum: ['price_focused', 'scope_creep', 'deadline_pressure'],
    },
  },
  briefText: { type: String },
  messages: [
    {
      role: { type: String, enum: ['user', 'client'] },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  scorecard: {
    finalAgreedPriceUSD: Number,
    clarityScore: { type: Number, min: 0, max: 10 },
    boundaryScore: { type: Number, min: 0, max: 10 },
    professionalismScore: { type: Number, min: 0, max: 10 },
    summaryText: { type: String, maxlength: 500 },
  },
});

module.exports = mongoose.model('NegotiationSession', NegotiationSessionSchema);
