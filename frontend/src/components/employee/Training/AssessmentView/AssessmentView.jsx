import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AssessmentView.css";
import PageHeader from "../../../common/PageHeader/PageHeader";

const API_BASE_URL = "http://localhost:8000";

const AssessmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canTake, setCanTake] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssessmentDetails();
  }, [id]);

  // Set up timer if time limit exists
  useEffect(() => {
    if (assessment && assessment.time_limit && timeLeft === null) {
      setTimeLeft(assessment.time_limit * 60); // Convert minutes to seconds
    }

    // Timer logic
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // Auto-submit when time runs out
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [assessment, timeLeft]);

  const fetchAssessmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/assessments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAssessment(response.data.assessment);
        setQuestions(response.data.questions);
        setCanTake(response.data.can_take);

        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach((question) => {
          initialAnswers[question.id] = "";
        });
        setAnswers(initialAnswers);
      } else {
        setError("Failed to load assessment");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching assessment:", err);
      setError("Failed to load assessment. Please try again.");
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter((q) => !answers[q.id]);

    if (unansweredQuestions.length > 0 && timeLeft > 0) {
      if (
        !window.confirm(
          `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      // Format answers for submission
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: parseInt(questionId),
        answer: answers[questionId],
      }));

      const response = await axios.post(
        `${API_BASE_URL}/api/v0.1/training/assessments/${id}/submit`,
        {
          answers: formattedAnswers,
          time_taken: assessment.time_limit * 60 - timeLeft, // time taken in seconds
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Navigate to result page
        navigate(`/employee/training/assessment/${id}/result`, {
          state: {
            result: response.data,
            fromSubmission: true,
          },
        });
      } else {
        setError("Failed to submit assessment");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setError("Failed to submit assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Render question based on type
  const renderQuestion = (question, index) => {
    switch (question.question_type) {
      case "multiple_choice":
        return (
          <div className="question multiple-choice">
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>{" "}
              {question.question_text}
            </div>
            <div className="answer-options">
              {question.options &&
                question.options.map((option, i) => (
                  <div className="option" key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                      />
                      <span>{option}</span>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        );

      case "true_false":
        return (
          <div className="question true-false">
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>{" "}
              {question.question_text}
            </div>
            <div className="answer-options">
              <div className="option">
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="True"
                    checked={answers[question.id] === "True"}
                    onChange={() => handleAnswerChange(question.id, "True")}
                  />
                  <span>True</span>
                </label>
              </div>
              <div className="option">
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="False"
                    checked={answers[question.id] === "False"}
                    onChange={() => handleAnswerChange(question.id, "False")}
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          </div>
        );

      case "short_answer":
        return (
          <div className="question short-answer">
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>{" "}
              {question.question_text}
            </div>
            <div className="answer-input">
              <input
                type="text"
                placeholder="Your answer"
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="question unsupported">
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>{" "}
              {question.question_text}
            </div>
            <div className="error-message">
              This question type is not supported.
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading assessment...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!assessment) {
    return <div className="error-message">Assessment not found</div>;
  }

  if (!canTake) {
    return (
      <div className="assessment-view">
        <PageHeader
          title={assessment.title}
          subTitle="Training"
          subSubTitle="Assessment"
        />

        <div className="cannot-take-message">
          <h3>You cannot take this assessment at this time</h3>
          <p>
            This may be because you have already passed this assessment or have
            reached the maximum number of attempts.
          </p>
          <button
            className="back-to-module-button"
            onClick={() =>
              navigate(`/employee/training/module/${assessment.module_id}`)
            }
          >
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-view">
      <PageHeader
        title={assessment.title}
        subTitle="Training"
        subSubTitle="Assessment"
      />

      <div className="assessment-container">
        <div className="assessment-header">
          <div className="assessment-info">
            <h3 className="assessment-title">{assessment.title}</h3>
            <p className="assessment-instructions">{assessment.instructions}</p>
            <div className="assessment-meta">
              <div className="meta-item">
                <span className="meta-label">Passing Score:</span>
                <span className="meta-value">{assessment.passing_score}%</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Questions:</span>
                <span className="meta-value">{questions.length}</span>
              </div>
            </div>
          </div>

          {timeLeft !== null && (
            <div className="timer-container">
              <div className={`timer ${timeLeft < 60 ? "timer-warning" : ""}`}>
                <span className="timer-label">Time Remaining:</span>
                <span className="timer-value">{formatTimeLeft(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={question.id} className="question-wrapper">
              {renderQuestion(question, index)}
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button
            className="back-button"
            onClick={() =>
              navigate(`/employee/training/module/${assessment.module_id}`)
            }
            disabled={isSubmitting}
          >
            Back to Module
          </button>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentView;
