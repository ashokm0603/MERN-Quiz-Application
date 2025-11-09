const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getStudentDetails,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Student registration/login
router.post("/studentregistration", register); // expects role: 'student' in body
router.post("/studentlogin", login); // expects role: 'student' in body

// Faculty registration/login
router.post("/facultyregistration", register); // expects role: 'faculty' in body
router.post("/facultylogin", login); // expects role: 'faculty' in body
// Protected route (only logged-in users can access)
router.get("/student/:id", protect, getStudentDetails);

module.exports = router;
