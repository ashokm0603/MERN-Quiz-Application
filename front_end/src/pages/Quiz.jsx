import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Button, ProgressBar, Form } from "react-bootstrap";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import QuestionCard from "../components/QuestionCard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/QuizX.css";

export default function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("Programming");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [attemptedSubjects, setAttemptedSubjects] = useState({});

  const timerRef = useRef(null);
  const currentQuestion = questions[index];

  // ✅ Fetch quiz questions with shuffle
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/quiz/question?subject=${encodeURIComponent(subject)}`);
      const data = res.data?.data || {};

      // Shuffle questions randomly for each student
      const shuffled = (data.questions || []).sort(() => Math.random() - 0.5);

      setQuestions(shuffled);
      setTotalDuration(data.totalDuration || 300);
      setTimeLeft(data.totalDuration || 300);
      setIndex(0);
      setAnswers({});
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load attempted subjects from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("attemptedSubjects") || "{}");
    setAttemptedSubjects(stored);
  }, []);

  // ✅ Fetch new questions when subject changes
  useEffect(() => {
    fetchQuestions();
  }, [subject]);

  // ✅ Timer logic
  useEffect(() => {
    if (!quizStarted || !totalDuration) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quizStarted, totalDuration]);

  // ✅ Format MM:SS
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const setSelected = (si) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion._id || index]: si }));
  };

  const handleNext = () => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
  };

  const handlePrev = () => index > 0 && setIndex((i) => i - 1);

  // ✅ Finish quiz and store attempt
  const handleFinish = async (auto = false) => {
    const payload = {
      subject,
      answers: questions.map((q) => ({
        question: q._id,
        selectedOptionIndex: answers[q._id] ?? null,
      })),
    };

    try {
      setLoading(true);
      const res = await axios.post("/api/quiz/attempt", payload);

      // Save this subject as attempted
      const updatedAttempts = { ...attemptedSubjects, [subject]: true };
      setAttemptedSubjects(updatedAttempts);
      localStorage.setItem("attemptedSubjects", JSON.stringify(updatedAttempts));

      toast.success(auto ? "Time’s up! Quiz submitted automatically." : "Quiz submitted!");
      navigate("/results", { state: { result: res.data.data } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent starting if already attempted
  const handleStart = () => {
    if (attemptedSubjects[subject]) {
      toast.warn(`You have already attempted the ${subject} quiz.`);
      return;
    }
    setQuizStarted(true);
  };

  // 🟩 Loader
  if (loading) return <Loader />;

  // 🟩 Step 1: Instructions Screen
  if (!quizStarted) {
    return (
      <Container className="quizX-instructions-container py-5 text-white">
        <motion.div
          className="quizX-card2 shadow-lg p-4 rounded-4 bg-dark"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-info mb-4">🧠 Quiz Instructions</h2>
          <ul className="text-start ms-3">
            <li>You have limited time to complete the quiz.</li>
            <li>Each question carries equal marks.</li>
            <li>Once you submit, your answers cannot be changed.</li>
            <li>Do not refresh or leave the page during the quiz.</li>
            <li>Automatic submission will occur when time expires.</li>
            <li>You can attempt each subject quiz only once.</li>
          </ul>

          <div className="mt-4 text-center">
            <Form.Check
              type="checkbox"
              id="agree"
              label="I have read and agree to the instructions."
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mb-3"
            />

            <Form.Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="quizX-select1 mb-3 w-50 mx-auto"
              disabled={quizStarted}
            >
              <option>Programming</option>
              <option>SQL</option>
              <option>Cloud</option>
            </Form.Select>

            {attemptedSubjects[subject] ? (
              <div className="text-danger fw-semibold">
                ⚠ You have already attempted the {subject} quiz.
              </div>
            ) : (
              <Button
                className="quizX-btn-start"
                variant="success"
                disabled={!agree}
                onClick={handleStart}
              >
                Start Quiz 🚀
              </Button>
            )}
          </div>
        </motion.div>
      </Container>
    );
  }

  // 🟩 Step 2: Main Quiz Interface
  if (!questions.length)
    return (
      <Container className="quizX-empty d-flex flex-column align-items-center justify-content-center text-center">
        <h4 className="text-white mb-3">No questions found for this subject</h4>
        <Form.Select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="quizX-select mb-3 w-50"
        >
          <option>Programming</option>
          <option>SQL</option>
          <option>Cloud</option>
        </Form.Select>
        <Button className="quizX-btn-reload" onClick={fetchQuestions}>
          Reload Questions
        </Button>
      </Container>
    );

  const selectedIndex = answers[currentQuestion._id || index] ?? null;
  const overallPercent =
    totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  return (
    <div className="quizX-wrapper py-4">
      <Container>
        <motion.div
          className="quizX-card1 shadow-lg p-4 rounded-4 bg-dark text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Row className="align-items-center mb-4">
            <Col>
              <div className="quizX-user-info">
                <strong className="quizX-user-name">{user?.name}</strong>
                <small className="ms-2 text-secondary">({user?.rollNo})</small>
              </div>
            </Col>
            <Col className="text-end">
              <Form.Select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="quizX-select"
                disabled={quizStarted}
              >
                <option>Programming</option>
                <option>SQL</option>
                <option>Cloud</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Timer */}
          <div className="quizX-timer mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="fw-semibold text-secondary">Total Time Left</small>
              <span className={`fw-bold ${timeLeft <= 10 ? "text-danger" : "text-info"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>
            <ProgressBar
              now={overallPercent}
              variant={timeLeft <= 10 ? "danger" : "info"}
              className="mt-1"
            />
          </div>

          {/* Main Layout */}
          <Row>
            <Col md={8}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelected}
                />
              </motion.div>

              {/* Navigation */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  className="quizX-btn-nav"
                  variant="outline-light"
                  onClick={handlePrev}
                  disabled={index === 0}
                >
                  ← Previous
                </Button>
                {index === questions.length - 1 ? (
                  <Button
                    className="quizX-btn-submit"
                    variant="success"
                    onClick={() => handleFinish(false)}
                  >
                    Finish Quiz
                  </Button>
                ) : (
                  <Button
                    className="quizX-btn-nav"
                    variant="primary"
                    onClick={handleNext}
                  >
                    Next →
                  </Button>
                )}
              </div>
            </Col>

            {/* Sidebar */}
            <Col md={4}>
              <div className="quizX-sidebar p-3 rounded-4 shadow-sm bg-light text-dark">
                <h6 className="fw-semibold text-center mb-2">Progress</h6>
                <small className="text-muted d-block text-center mb-2">
                  {index + 1} / {questions.length}
                </small>
                <ProgressBar now={((index + 1) / questions.length) * 100} className="mb-3" />

                <div className="quizX-question-area">
                  <div className="quizX-question-grid d-flex flex-wrap gap-2 justify-content-center">
                    {questions.map((q, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={
                          answers[q._id || i] != null
                            ? "success"
                            : i === index
                              ? "primary"
                              : "outline-secondary"
                        }
                        onClick={() => setIndex(i)}
                        className="quizX-btn-question"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
}
