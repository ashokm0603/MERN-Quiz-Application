import React from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/QuizXResults.css";

export default function Results() {
  const { state } = useLocation();
  const result = state?.result || { totalScore: 0, totalPossible: 0, details: [] };
  const details = Array.isArray(result.details) ? result.details : [];
  const percent = result.totalPossible
    ? Math.round((result.totalScore / result.totalPossible) * 100)
    : 0;

  return (




    <Container className="quizX-result-main-container">
      <Container className="quizX-result-container mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="quizX-result-card p-4">
            <div className="quizX-result-header">
              <h3 className="quizX-title">🏁 Quiz Results</h3>

              <motion.div
                className="quizX-circle-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="quizX-circle"
                  style={{
                    background: `conic-gradient(
                    #00c6ff ${percent * 3.6}deg,
                    rgba(255, 255, 255, 0.08) ${percent * 3.6}deg
                  )`,
                  }}
                >
                  <div className="quizX-circle-inner">
                    <span className="quizX-percent">{percent}%</span>
                  </div>
                </div>
                <div className="quizX-score-text mt-2">
                  {result.totalScore}/{result.totalPossible}
                </div>
              </motion.div>
            </div>

            <hr className="quizX-divider" />

            <h5 className="quizX-section-title">Question Breakdown</h5>

            {details.length > 0 ? (
              <Row>
                {details.map((d, i) => {
                  const correct = d.correct;
                  return (
                    <Col md={6} key={i} className="mb-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`quizX-question-card ${correct ? "correct" : "wrong"}`}
                      >
                        <Card className="quizX-qcard-inner">
                          <Card.Body>
                            <Card.Title className="quizX-qtitle">
                              Q{i + 1}. {d.questionText}
                            </Card.Title>
                            <div>
                              Your Answer:{" "}
                              <Badge bg={correct ? "success" : "danger"}>
                                {d.selectedAnswerText ?? "No Answer"}
                              </Badge>
                            </div>
                            <div className="mt-1">
                              Correct Answer:{" "}
                              <Badge bg="info" text="dark">
                                {d.correctAnswerText}
                              </Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <div className="text-center text-muted mt-3">
                No question details available.
              </div>
            )}

            <div className="quizX-btns mt-4 text-center">
              <Link to="/quiz" className="btn quizX-btn-outline me-2">
                Take Another Quiz
              </Link>
              <Link to="/" className="btn quizX-btn">
                Home
              </Link>
            </div>
          </Card>
        </motion.div>
      </Container>

    </Container>

  );
}
