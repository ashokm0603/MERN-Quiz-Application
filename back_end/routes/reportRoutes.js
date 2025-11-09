const express = require("express");
const router = express.Router();
const { getStudentReports } = require("../controllers/reportController");
const { protect, authorizeRole } = require("../middlewares/authMiddleware");

// Faculty can view all student reports
router.get(
  "/student-summary",
  protect,
  authorizeRole("faculty"),
  getStudentReports
);

module.exports = router;
