const asyncHandler = require("express-async-handler");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const { questionSchema } = require("../utils/validator");

/* -------------------------------------------------------------------------- */
/* ✅ FACULTY: Create Question                                                */
/* -------------------------------------------------------------------------- */
// POST /api/quiz/question (faculty only)
const createQuestion = asyncHandler(async (req, res) => {
  const { error } = questionSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  const {
    subject,
    questionText,
    options,
    correctOptionIndex,
    marks,
    duration,
  } = req.body;

  // Validate options
  if (
    !Array.isArray(options) ||
    options.length < 2 ||
    !options.every((opt) => typeof opt === "object" && "text" in opt)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Each option must be an object with a 'text' field (minimum 2 options required)",
    });
  }

  // Validate correctOptionIndex
  if (
    typeof correctOptionIndex !== "number" ||
    correctOptionIndex < 0 ||
    correctOptionIndex >= options.length
  ) {
    return res
      .status(400)
      .json({ success: false, message: "correctOptionIndex is out of range" });
  }

  // Check for duplicate question
  const existing = await Question.findOne({ questionText });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "This question already exists" });

  const question = await Question.create({
    faculty: req.user.id,
    subject,
    questionText,
    options, // ← array of objects like [{ text: "SELECT" }]
    correctOptionIndex,
    marks,
    duration,
  });

  return res.status(201).json({
    success: true,
    message: "Question created successfully",
    data: question,
  });
});

/* -------------------------------------------------------------------------- */
/* ✅ STUDENT & FACULTY: Get Questions by Subject                            */
/* -------------------------------------------------------------------------- */
// GET /api/quiz/question?subject=subjectname
const getQuestionsBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.query;

  if (!subject)
    return res
      .status(400)
      .json({ success: false, message: "Subject query parameter is required" });

  const projection =
    req.user.role === "student"
      ? "-__v -faculty -correctOptionIndex"
      : "-__v -faculty";

  const questions = await Question.find({ subject }).select(projection).lean();

  if (!questions || questions.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No questions found for subject: ${subject}`,
    });
  }

  // Optional: total duration for quiz
  const totalDuration = questions.reduce(
    (sum, q) => sum + (q.duration || 0),
    0
  );

  res.status(200).json({
    success: true,
    message: "Questions fetched successfully",
    data: {
      subject,
      count: questions.length,
      totalDuration,
      questions,
    },
  });
});

/* -------------------------------------------------------------------------- */
/* ✅ STUDENT/FACULTY: Get All or Filtered Questions (with Pagination)       */
/* -------------------------------------------------------------------------- */
// GET /api/quiz/questions?subject=SQL&page=1&limit=10
const getQuestions = asyncHandler(async (req, res) => {
  const { subject, page = 1, limit = 30 } = req.query;

  const filter = {};
  if (subject) filter.subject = subject;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const projection =
    req.user.role === "student"
      ? "-__v -faculty -correctOptionIndex"
      : "-__v -faculty";

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .select(projection)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Question.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Questions fetched successfully",
    data: {
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      count: questions.length,
      total,
      questions,
    },
  });
});

/* -------------------------------------------------------------------------- */
/* ✅ STUDENT: Submit Quiz Attempt                                           */
/* -------------------------------------------------------------------------- */
// POST /api/quiz/attempt
const submitAttempt = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  if (req.user.role !== "student") {
    return res
      .status(403)
      .json({ success: false, message: "Only students can submit attempts" });
  }

  const { subject, answers } = req.body;

  if (!subject || !Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: "Subject and answers array are required",
    });
  }

  const questionIds = answers.map((a) => a.question);
  const questions = await Question.find({ _id: { $in: questionIds } });

  const qMap = new Map();
  questions.forEach((q) => qMap.set(String(q._id), q));

  let totalScore = 0;
  let totalPossible = 0;
  const details = [];

  for (const a of answers) {
    const q = qMap.get(String(a.question));
    if (!q) continue;

    const correct = a.selectedOptionIndex === q.correctOptionIndex;
    totalPossible += q.marks || 1;
    if (correct) totalScore += q.marks || 1;

    details.push({
      questionText: q.questionText,
      correct,
      selectedAnswerText:
        typeof a.selectedOptionIndex === "number"
          ? q.options[a.selectedOptionIndex]?.text ||
            q.options[a.selectedOptionIndex]
          : null,
      correctAnswerText:
        q.options[q.correctOptionIndex]?.text ||
        q.options[q.correctOptionIndex],
    });
  }

  const percentage = ((totalScore / totalPossible) * 100).toFixed(2);

  await Attempt.create({
    student: studentId,
    subject,
    answers,
    totalScore,
    totalPossible,
  });

  res.status(201).json({
    success: true,
    message: "Attempt submitted successfully",
    data: {
      subject,
      totalScore,
      totalPossible,
      percentage,
      details,
    },
  });
});

/* -------------------------------------------------------------------------- */
/* ✅ STUDENT: View My Attempts                                              */
/* -------------------------------------------------------------------------- */
// GET /api/quiz/attempts/my
const getMyAttempts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const attempts = await Attempt.find({ student: userId })
    .populate(
      "answers.question",
      "questionText options correctOptionIndex subject"
    )
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Attempts fetched successfully",
    data: {
      count: attempts.length,
      attempts,
    },
  });
});

/* -------------------------------------------------------------------------- */
/* ✅ EXPORTS                                                                */
/* -------------------------------------------------------------------------- */
module.exports = {
  createQuestion,
  getQuestions,
  getQuestionsBySubject,
  submitAttempt,
  getMyAttempts,
};
