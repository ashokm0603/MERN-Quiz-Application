const Attempt = require("../models/Attempt");
const User = require("../models/User");

// ✅ Get summarized student reports by subject
const getStudentReports = async (req, res) => {
  try {
    // Faculty-only access
    if (req.user.role !== "faculty") {
      return res
        .status(403)
        .json({ success: false, message: "Only faculty can view student reports" });
    }

    // 1️⃣ Aggregate attempts by student and subject
    const attemptsSummary = await Attempt.aggregate([
      {
        $group: {
          _id: { student: "$student", subject: "$subject" },
          totalScore: { $sum: "$totalScore" },
          totalPossible: { $sum: "$totalPossible" },
          attemptsCount: { $sum: 1 },
          lastAttemptedAt: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users", // collection name in MongoDB
          localField: "_id.student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
      {
        $project: {
          _id: 0,
          subject: "$_id.subject",
          rollNo: "$studentDetails.rollNo",
          name: "$studentDetails.name",
          email: "$studentDetails.email",
          totalScore: 1,
          totalPossible: 1,
          attemptsCount: 1,
          lastAttemptedAt: 1,
        },
      },
      { $sort: { subject: 1, name: 1 } },
    ]);

    // 2️⃣ If no records
    if (!attemptsSummary.length) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No student attempts found" });
    }

    // 3️⃣ Return summary
    res.status(200).json({
      success: true,
      message: "Student reports fetched successfully",
      data: attemptsSummary,
    });
  } catch (err) {
    console.error("Error fetching student reports:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};

module.exports = { getStudentReports };
