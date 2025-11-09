const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOptionIndex: { type: Number, required: false } // can be null if skipped
});

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  answers: { type: [answerSchema], default: [] },
  totalScore: { type: Number, default: 0 },
  totalPossible: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);
