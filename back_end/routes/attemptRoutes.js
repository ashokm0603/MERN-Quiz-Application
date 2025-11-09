const express = require("express");
const router = express.Router();
const { getStudentResults } = require("../controllers/attemptController");

// ✅ Route to fetch a student's quiz attempts
router.get("/student/:studentId", getStudentResults);

module.exports = router;
