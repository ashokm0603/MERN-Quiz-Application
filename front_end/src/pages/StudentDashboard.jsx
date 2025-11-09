import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import "../styles/StudentDashboard.css";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
    const { user, token } = useAuth();
    const [student, setStudent] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [groupedAttempts, setGroupedAttempts] = useState([]);
    const [activeTab, setActiveTab] = useState("details");
    const [loading, setLoading] = useState(true);

    // 🟢 Fetch Student Details
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await axios.get(`/api/auth/student/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudent(res.data);
            } catch (err) {
                console.error("Error fetching student:", err);
            }
        };
        fetchStudent();
    }, [user.id, token]);

    // 🟢 Fetch Attempted Quizzes and Results
    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await axios.get(`/api/attempts/student/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setAttempts(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching attempts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, [user.id, token]);

    // 🧮 Group Attempts by Subject
    useEffect(() => {
        if (attempts.length > 0) {
            const grouped = attempts.reduce((acc, curr) => {
                const key = curr.subject;
                if (!acc[key]) {
                    acc[key] = {
                        subject: key,
                        totalScore: 0,
                        totalPossible: 0,
                        attemptsCount: 0,
                        latestDate: curr.createdAt,
                    };
                }
                acc[key].totalScore += curr.totalScore;
                acc[key].totalPossible += curr.totalPossible;
                acc[key].attemptsCount += 1;

                // Update latest date if newer
                if (new Date(curr.createdAt) > new Date(acc[key].latestDate)) {
                    acc[key].latestDate = curr.createdAt;
                }
                return acc;
            }, {});
            setGroupedAttempts(Object.values(grouped));
        }
    }, [attempts]);

    if (!student || loading) {
        return <div className="student-loading">Loading student data...</div>;
    }

    // 🧠 Helper: Remarks based on performance
    const getRemarks = (percentage) => {
        if (percentage >= 90) return "🌟 Excellent";
        if (percentage >= 75) return "👍 Good";
        if (percentage >= 50) return "🙂 Fair";
        return "⚠️ Needs Improvement";
    };

    return (
        <div className="student-dashboard-container">
            <h2 className="student-dashboard-title">🎓 Student Dashboard</h2>

            {/* Profile Section */}
            <div className="student-profile-card glass-card">
                <div className="student-avatar">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Student Avatar"
                    />
                </div>
                <div className="student-info">
                    <h4>{student.name}</h4>
                    <p>
                        <strong>Roll No:</strong> {student.rollNo || "N/A"}
                    </p>
                    <p>
                        <strong>Email:</strong> {student.email}
                    </p>
                    <p>
                        <strong>Course:</strong> B.Tech - CSE
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="student-tab-buttons">
                <button
                    className={`student-tab-btn ${activeTab === "details" ? "active" : ""}`}
                    onClick={() => setActiveTab("details")}
                >
                    🧾 Details
                </button>
                <button
                    className={`student-tab-btn ${activeTab === "takequiz" ? "active" : ""}`}
                    onClick={() => setActiveTab("takequiz")}
                >
                    🧠 Take Quiz
                </button>
                <button
                    className={`student-tab-btn ${activeTab === "attempted" ? "active" : ""}`}
                    onClick={() => setActiveTab("attempted")}
                >
                    🕒 Attempted Quizzes
                </button>
                <button
                    className={`student-tab-btn ${activeTab === "results" ? "active" : ""}`}
                    onClick={() => setActiveTab("results")}
                >
                    📊 Results
                </button>
            </div>

            {/* Dynamic Content */}
            <div className="student-content glass-card">
                {/* 🧾 Details Tab */}
                {activeTab === "details" && (
                    <div>
                        <h4>Student Information</h4>
                        <p>
                            Welcome {student.name}! You can view your profile, take quizzes,
                            check your attempts, and view your results here.
                        </p>
                    </div>
                )}

                {/* 🧠 Take Quiz Tab */}
                {activeTab === "takequiz" && (
                    <div>
                        <h4>Available Quizzes</h4>
                        <ul className="quiz-list">
                            <li>SQL Basics</li>
                            <li>Java Fundamentals</li>
                            <li>React Essentials</li>
                        </ul>
                        <button className="quiz-start-btn">Start Quiz</button>
                    </div>
                )}

                {/* 🕒 Attempted Quizzes */}
                {activeTab === "attempted" && (
                    <div>
                        <h4>Attempted Quizzes (Grouped by Subject)</h4>
                        {groupedAttempts.length === 0 ? (
                            <p>No attempts found yet.</p>
                        ) : (
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Attempted Questions </th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedAttempts.map((a, idx) => (
                                        <tr key={idx}>
                                            <td>{a.subject}</td>
                                            <td>{a.attemptsCount}</td>
                                            <td>{new Date(a.latestDate).toLocaleDateString()}</td>
                                            <td>Completed</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* 📊 Results */}
                {activeTab === "results" && (
                    <div>
                        <h4>Results (Grouped by Subject)</h4>
                        {groupedAttempts.length === 0 ? (
                            <p>No results available.</p>
                        ) : (
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Score</th>
                                        <th>Percentage</th>
                                        <th>Remarks</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedAttempts.map((a, idx) => {
                                        const percentage = ((a.totalScore / a.totalPossible) * 100).toFixed(2);
                                        return (
                                            <tr key={idx}>
                                                <td>{a.subject}</td>
                                                <td>
                                                    {a.totalScore} / {a.totalPossible}
                                                </td>
                                                <td>{percentage}%</td>
                                                <td>{getRemarks(percentage)}</td>
                                                <td>{new Date(a.latestDate).toLocaleDateString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
