const Attempt = require("../models/Attempt");
const Question = require("../models/Question");
const User = require("../models/User");

// ✅ Get all quiz attempts of a student (with question details)
const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const attempts = await Attempt.find({ student: studentId }).sort({
      createdAt: -1,
    });
    if (!attempts.length) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No attempts found" });
    }

    const detailedAttempts = await Promise.all(
      attempts.map(async (attempt) => {
        const detailedAnswers = await Promise.all(
          attempt.answers.map(async (ans) => {
            const question = await Question.findById(ans.question);
            return {
              questionText: question?.questionText || "Question not found",
              options: question?.options || [],
              correctOptionIndex: question?.correctOptionIndex,
              selectedOptionIndex: ans.selectedOptionIndex,
              isCorrect:
                ans.selectedOptionIndex === question?.correctOptionIndex,
              marks: question?.marks || 0,
            };
          })
        );

        const totalCorrect = detailedAnswers.filter((a) => a.isCorrect).length;
        const totalQuestions = detailedAnswers.length;

        return {
          subject: attempt.subject,
          createdAt: attempt.createdAt,
          totalScore: attempt.totalScore,
          totalPossible: attempt.totalPossible,
          totalCorrect,
          totalQuestions,
          detailedAnswers,
        };
      })
    );

    res.status(200).json({ success: true, data: detailedAttempts });
  } catch (err) {
    console.error("Error fetching student results:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getStudentResults };
