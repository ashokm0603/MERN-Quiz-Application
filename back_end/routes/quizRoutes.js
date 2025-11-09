const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middlewares/authMiddleware");
const quizController = require("../controllers/quizController");

// Faculty uploads questions
// POST /api/quiz/question
router.post(
  "/question",
  protect,
  authorizeRole("faculty"),
  quizController.createQuestion
);

// ✅ New endpoint: Get questions by subject
// GET /api/quiz/question?subject=SQL
router.get("/question", protect, quizController.getQuestionsBySubject);

// Get questions (students or faculty) - with optional limit
// GET /api/quiz/questions
router.get("/questions", protect, quizController.getQuestions);

// Student submit answers
// POST /api/quiz/attempt
router.post("/attempt", protect, quizController.submitAttempt);

// Student get their attempts
// GET /api/quiz/attempts/my
router.get("/attempts/my", protect, quizController.getMyAttempts);

module.exports = router;
