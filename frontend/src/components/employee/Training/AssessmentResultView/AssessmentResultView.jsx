import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AssessmentResultView.css";
import PageHeader from "../../../common/PageHeader/PageHeader";

const API_BASE_URL = "http://localhost:8000";

const AssessmentResultView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!result) {
      fetchAssessmentResult();
    }
  }, [id]);

  const fetchAssessmentResult = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/assessments/${id}/result`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError("Failed to load assessment result");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching assessment result:", err);
      setError("Failed to load assessment result. Please try again.");
      setLoading(false);
    }
  };

  const handleRetakeAssessment = () => {
    navigate(`/employee/training/assessment/${id}`);
  };

  const handleBackToModule = () => {
    if (result && result.module_id) {
      navigate(`/employee/training/module/${result.module_id}`);
    } else {
      // Fallback - go to courses page
      navigate("/employee/training");
    }
  };

  const handleViewCertificate = () => {
    if (result && result.certificate_url) {
      window.open(result.certificate_url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">Loading assessment result...</div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!result) {
    return <div className="error-message">Assessment result not found</div>;
  }

  const scorePercentage = result.score;
  const isPassed = result.passed;

  return (
    <div className="assessment-result-view">
      <PageHeader
        title="Assessment Result"
        subTitle="Training"
        subSubTitle="Result"
      />

      <div className="result-container">
        <div className={`result-header ${isPassed ? "passed" : "failed"}`}>
          <div className="result-status">
            {isPassed ? (
              <>
                <div className="status-icon passed">✓</div>
                <h3 className="status-text">Assessment Passed!</h3>
              </>
            ) : (
              <>
                <div className="status-icon failed">✗</div>
                <h3 className="status-text">Assessment Failed</h3>
              </>
            )}
          </div>

          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">
                {Math.round(scorePercentage)}%
              </span>
            </div>
            <div className="score-label">Your Score</div>
          </div>
        </div>

        {result.results && (
          <div className="result-details">
            <h3 className="details-title">Question Results</h3>
            <div className="questions-results">
              {result.results.map((questionResult, index) => (
                <div
                  key={questionResult.question_id}
                  className={`question-result ${
                    questionResult.correct ? "correct" : "incorrect"
                  }`}
                >
                  <div className="question-result-header">
                    <span className="question-number">
                      Question {index + 1}
                    </span>
                    <span className="question-points">
                      {questionResult.correct ? (
                        <span className="points-earned">
                          +{questionResult.points} points
                        </span>
                      ) : (
                        <span className="points-missed">0 points</span>
                      )}
                    </span>
                  </div>
                  <div className="question-result-status">
                    {questionResult.correct ? (
                      <span className="result-indicator correct">Correct</span>
                    ) : (
                      <span className="result-indicator incorrect">
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          <button
            className="back-to-module-button"
            onClick={handleBackToModule}
          >
            Back to Module
          </button>

          {!isPassed && result.attempts_remaining > 0 && (
            <button className="retake-button" onClick={handleRetakeAssessment}>
              Retake Assessment ({result.attempts_remaining} attempts left)
            </button>
          )}

          {isPassed && result.certificate_url && (
            <button
              className="certificate-button"
              onClick={handleViewCertificate}
            >
              View Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultView;
