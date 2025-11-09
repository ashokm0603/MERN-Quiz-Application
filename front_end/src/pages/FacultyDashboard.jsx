import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {
  useAuth();

  const [form, setForm] = useState({
    subject: "Programming",
    questionText: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOptionIndex: 0,
    marks: 1,
    duration: 30,
  });

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentReports, setStudentReports] = useState([]);
  const [quizStats, setQuizStats] = useState({ count: 0, totalDuration: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");

  /* -------------------------------------------------------------------------- */
  /* 🧭 Fetch questions by subject (/api/quiz/questions) */
  /* -------------------------------------------------------------------------- */
  const fetchMyQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quiz/questions?subject=${encodeURIComponent(form.subject)}`);
      if (res.data.success && res.data.data) {
        const { questions, count, totalDuration } = res.data.data;
        setQuestions(questions || []);
        setQuizStats({ count, totalDuration });
      } else {
        setQuestions([]);
        setQuizStats({ count: 0, totalDuration: 0 });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuestions();
  }, [form.subject]);

  /* -------------------------------------------------------------------------- */
  /* 🧾 Fetch Student Reports (/api/reports/student-summary) */
  /* -------------------------------------------------------------------------- */
  const fetchStudentReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/reports/student-summary");
      if (res.data.success && res.data.data) {
        const reports = res.data.data.map((r) => ({
          rollNo: r.rollNo || "N/A",
          name: r.name || "Unknown",
          subject: r.subject,
          score: r.totalScore,
          total: r.totalPossible,
          attempts: r.attemptsCount,
          lastAttemptedAt: new Date(r.lastAttemptedAt).toLocaleDateString(),
        }));
        setStudentReports(reports);
      } else {
        setStudentReports([]);
      }
    } catch (err) {
      toast.error("Failed to load student summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentReports();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✨ Create a new question */
  /* -------------------------------------------------------------------------- */
  const submitQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...form };
      const res = await axios.post("/api/quiz/question", payload);
      const newQuestion = res.data?.data;
      toast.success("Question added successfully!");
      setShowModal(true);
      if (newQuestion) setQuestions((prev) => [newQuestion, ...prev]);
      setForm({
        subject: form.subject,
        questionText: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctOptionIndex: 0,
        marks: 1,
        duration: 30,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = { text: value };
    setForm({ ...form, options: updatedOptions });
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  const subjectsCount = new Set(questions.map((q) => q.subject)).size;

  const filteredReports = studentReports.filter((report) => {
    const matchesSearch =
      report.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      filterSubject === "All" || report.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <Container className="container-faculty-dashboard py-5">
      <motion.h2
        className="faculty-dashboard-title text-center mb-5"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        Faculty Dashboard
      </motion.h2>

      <Row className="gy-4">
        <Container className="container-faculty">
          {/* Add Question Section */}
          <Col md={6} lg={4}>
            <motion.div
              className="faculty-form-card p-4 rounded shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h5 className="text-center mb-3">Add Question</h5>
              <Form onSubmit={submitQuestion}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Subject</Form.Label>
                  <Form.Select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option>Programming</option>
                    <option>SQL</option>
                    <option>Cloud</option>
                    <option>Java</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    value={form.questionText}
                    placeholder="Enter question..."
                    onChange={(e) =>
                      setForm({ ...form, questionText: e.target.value })
                    }
                  />
                </Form.Group>

                {form.options.map((opt, idx) => (
                  <Form.Group className="mb-2" key={idx}>
                    <Form.Label>Option {idx + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={opt.text}
                      placeholder={`Enter option ${idx + 1}`}
                      onChange={(e) => updateOption(idx, e.target.value)}
                    />
                  </Form.Group>
                ))}

                <Row>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Correct Index</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        max={3}
                        value={form.correctOptionIndex}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            correctOptionIndex: Number(e.target.value),
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Marks</Form.Label>
                      <Form.Control
                        type="number"
                        value={form.marks}
                        onChange={(e) =>
                          setForm({ ...form, marks: Number(e.target.value) })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Duration (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    min={10}
                    max={600}
                    step={10}
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: Number(e.target.value) })
                    }
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Add Question"}
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Col>

          {/* Stats Card */}
          <Col>
            <motion.div
              className="stats-card p-4 rounded shadow-sm text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h5 className="mb-4">📊 Stats</h5>
              <p>Total Questions: <strong>{quizStats.count}</strong></p>
              <p>Total Marks: <strong>{totalMarks}</strong></p>
              <p>Total Duration: <strong>{quizStats.totalDuration}s</strong></p>
              <p>Subjects Count: <strong>{subjectsCount}</strong></p>
            </motion.div>
          </Col>
        </Container>

        {/* ✅ Recent Questions Section */}
        <Col md={12}>
          <motion.div
            className="faculty-table-card p-4 rounded shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="text-center mb-3">📝 Recent Questions</h5>
            {loading ? (
              <Loader />
            ) : questions.length > 0 ? (
              <div className="faculty-table-wrapper">
                <Table bordered hover responsive size="sm">
                  <thead className="table-secondary">
                    <tr>
                      <th>Sl No</th>
                      <th>Question</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{q.questionText}</td>
                        <td>{q.subject}</td>
                        <td>{q.marks}</td>
                        <td>{q.duration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted mb-0">
                No questions available for this subject.
              </p>
            )}
          </motion.div>
        </Col>

        {/* Student Reports */}
        <Col md={12}>
          <motion.div
            className="faculty-table-card p-4 rounded shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="text-center mb-3">📘 Student Reports</h5>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search by Roll No or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filterSubject}
                  className="subject-select"
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="All">All Subjects</option>
                  <option value="Programming">Programming</option>
                  <option value="SQL">SQL</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Java">Java</option>
                </Form.Select>
              </Col>
            </Row>

            <div className="faculty-table-wrapper">
              {loading ? (
                <Loader />
              ) : (
                <Table bordered hover responsive size="sm">
                  <thead className="table-info">
                    <tr>
                      <th>Sl No</th>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Total</th>
                      <th>Attempts</th>
                      <th>Last Attempted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((s, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{s.rollNo}</td>
                          <td>{s.name}</td>
                          <td>{s.subject}</td>
                          <td>{s.score}</td>
                          <td>{s.total}</td>
                          <td>{s.attempts}</td>
                          <td>{s.lastAttemptedAt}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No matching reports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </div>
          </motion.div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✅ Question Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your question has been successfully created!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
