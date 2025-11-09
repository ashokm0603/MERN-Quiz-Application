const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true }, // e.g., 'SQL', 'Programming', 'Cloud'
  questionText: { type: String, required: true },
  options: { type: [optionSchema], required: true }, // at least 2 options
  correctOptionIndex: { type: Number, required: true }, // index into options array
  marks: { type: Number, default: 1 },
  duration: { type: Number, default: 60, required: true }, // ✅ duration in seconds (default 60)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
