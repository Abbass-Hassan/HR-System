import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ModuleView.css";
import PageHeader from "../../../common/PageHeader/PageHeader";

const API_BASE_URL = "http://localhost:8001";

const ModuleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextModule, setNextModule] = useState(null);

  useEffect(() => {
    fetchModuleDetails();

    // Track module access
    trackModuleAccess();

    return () => {
      // If the user navigates away, make sure we track the access duration
      trackModuleAccess();
    };
  }, [id]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/v0.1/training/modules/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setModule(response.data.module);
        setProgress(response.data.progress);
        setNextModule(response.data.next_module);
      } else {
        setError("Failed to load module information");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching module details:", err);
      setError("Failed to load module information. Please try again.");
      setLoading(false);
    }
  };

  const trackModuleAccess = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/api/v0.1/training/modules/${id}/access`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error tracking module access:", err);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/v0.1/training/modules/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update the local state
        setProgress({
          ...progress,
          is_completed: true,
          completion_date: new Date().toISOString(),
        });

        // Show success message or update UI
        alert("Module marked as complete!");
      }
    } catch (err) {
      console.error("Error marking module as complete:", err);
      alert("Failed to mark module as complete. Please try again.");
    }
  };

  const handleStartAssessment = () => {
    if (module && module.has_assessment && module.assessment) {
      navigate(`/employee/training/assessment/${module.assessment.id}`);
    }
  };

  const handleContinueCourse = () => {
    if (module && module.course) {
      // Navigate to the enrollment view
      navigate(`/employee/training/course/${module.course.id}`);
    }
  };

  const handleNextModule = () => {
    if (nextModule) {
      navigate(`/employee/training/module/${nextModule.id}`);
    }
  };

  // Helper function to render content based on type
  const renderContent = () => {
    if (!module) return null;

    switch (module.content_type.toLowerCase()) {
      case "video":
        return (
          <div className="video-content">
            <div className="video-container">
              {module.content_url ? (
                // For embedded videos
                <iframe
                  src={module.content_url}
                  title={module.module_name}
                  allowFullScreen
                  className="module-video"
                ></iframe>
              ) : (
                <div className="video-placeholder">
                  <p>Video not available</p>
                </div>
              )}
            </div>
          </div>
        );

      case "text":
        return (
          <div className="text-content">
            <div
              className="text-container"
              dangerouslySetInnerHTML={{
                __html: module.content || "<p>No content available</p>",
              }}
            />
          </div>
        );

      case "presentation":
        return (
          <div className="presentation-content">
            {module.content_url ? (
              <div className="presentation-container">
                <iframe
                  src={module.content_url}
                  title={module.module_name}
                  className="module-presentation"
                ></iframe>
              </div>
            ) : (
              <div className="presentation-placeholder">
                <p>Presentation not available</p>
              </div>
            )}
          </div>
        );

      case "interactive":
        return (
          <div className="interactive-content">
            {module.content_url ? (
              <div className="interactive-container">
                <iframe
                  src={module.content_url}
                  title={module.module_name}
                  className="module-interactive"
                ></iframe>
              </div>
            ) : (
              <div className="interactive-placeholder">
                <p>Interactive content not available</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="unknown-content">
            <p>This content type is not supported for preview.</p>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading module content...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!module) {
    return <div className="error-message">Module not found</div>;
  }

  return (
    <div className="module-view">
      <PageHeader
        title={module.module_name}
        subTitle={module.course.course_name}
        subSubTitle="Module"
      />

      <div className="module-view-content">
        {renderContent()}

        <div className="module-actions">
          <button className="back-button" onClick={handleContinueCourse}>
            Back to Course
          </button>

          {module.has_assessment && (
            <button
              className="assessment-button"
              onClick={handleStartAssessment}
              disabled={progress && progress.assessment_passed}
            >
              {progress && progress.assessment_passed
                ? "Assessment Passed"
                : "Take Assessment"}
            </button>
          )}

          {!module.has_assessment && (
            <button
              className="complete-button"
              onClick={handleMarkComplete}
              disabled={progress && progress.is_completed}
            >
              {progress && progress.is_completed
                ? "Completed"
                : "Mark as Complete"}
            </button>
          )}

          {nextModule && (
            <button className="next-button" onClick={handleNextModule}>
              Next Module
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleView;
