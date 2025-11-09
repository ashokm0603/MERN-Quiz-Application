import React from "react";
import { motion } from "framer-motion";
import "../styles/QuizX.css";

export default function QuestionCard({
  question,
  selectedIndex,
  setSelectedIndex,
}) {
  if (!question) return null;

  const questionText =
    question.questionText ||
    question.text ||
    question.question?.text ||
    "Untitled Question";

  const options = Array.isArray(question.options)
    ? question.options.map((opt) => (typeof opt === "object" ? opt.text : opt))
    : [];

  return (
    <motion.div
      className="quizX-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25 }}
    >
      <div className="quizX-header">
        <h5 className="fw-semibold">{questionText}</h5>
      </div>

      <div className="quizX-options mt-3">
        {options.length > 0 ? (
          options.map((opt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <motion.label
                key={idx}
                className={`quizX-option ${isSelected ? "selected" : ""}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedIndex(idx)}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => setSelectedIndex(idx)}
                  name={`question-${question._id}`}
                />
                <span>{opt}</span>
              </motion.label>
            );
          })
        ) : (
          <div className="text-muted small">No options available</div>
        )}
      </div>
    </motion.div>
  );
}
