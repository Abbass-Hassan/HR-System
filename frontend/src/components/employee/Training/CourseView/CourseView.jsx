import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseView.css';
import PageHeader from '../../../common/PageHeader/PageHeader';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';

const API_BASE_URL = 'http://localhost:8000';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollmentDetails();
  }, [id]);

  const fetchEnrollmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/training/enrollments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEnrollment(response.data.enrollment);
      } else {
        setError('Failed to load course information');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError('Failed to load course information. Please try again.');
      setLoading(false);
    }
  };

  const handleStartModule = (moduleId) => {
    navigate(`/employee/training/module/${moduleId}`);
  };

  // Find the next uncompleted module to show "Continue from where you left off"
  const findNextModule = () => {
    if (!enrollment || !enrollment.moduleProgress) return null;
    
    const incompleteModule = enrollment.moduleProgress.find(progress => !progress.is_completed);
    return incompleteModule ? incompleteModule.module : null;
  };

  const nextModule = findNextModule();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-indicator">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!enrollment) {
    return <div className="error-message">Course enrollment not found</div>;
  }

  return (
    <div className="course-view">
      <PageHeader 
        title={enrollment.course.course_name} 
        subTitle="Training" 
        subSubTitle="Course details" 
      />
      
      <div className="course-view-header">
        <div className="course-view-info">
          <div className="course-view-status">
            <StatusBadge status={enrollment.status === 'completed' ? 'completed' : 'in progress'} />
          </div>
          <div className="course-view-meta">
            <div className="meta-item">
              <span className="meta-label">Provider:</span>
              <span className="meta-value">{enrollment.course.provider || 'Not specified'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Enrolled on:</span>
              <span className="meta-value">{formatDate(enrollment.enrollment_date)}</span>
            </div>
            {enrollment.completion_date && (
              <div className="meta-item">
                <span className="meta-label">Completed on:</span>
                <span className="meta-value">{formatDate(enrollment.completion_date)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="course-view-progress">
          <h3 className="progress-title">Your Progress</h3>
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large" 
              style={{ width: `${enrollment.completion_percentage}%` }}
            ></div>
          </div>
          <span className="progress-text-large">{Math.round(enrollment.completion_percentage)}% Complete</span>
        </div>
      </div>
      
      {nextModule && (
        <div className="continue-section">
          <h3 className="continue-title">Continue where you left off</h3>
          <div className="continue-module">
            <div className="module-info">
              <h4 className="module-title">{nextModule.module_name}</h4>
              <p className="module-description">{nextModule.description || 'No description available'}</p>
            </div>
            <button 
              className="continue-button"
              onClick={() => handleStartModule(nextModule.id)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      <div className="modules-section">
        <h3 className="modules-title">Course Modules</h3>
        <div className="modules-list">
          {enrollment.moduleProgress && enrollment.moduleProgress.map((progress) => (
            <div 
              key={progress.module.id} 
              className={`module-item ${progress.is_completed ? 'completed' : ''}`}
              onClick={() => handleStartModule(progress.module.id)}
            >
              <div className="module-status">
                {progress.is_completed ? (
                  <span className="status-icon completed">✓</span>
                ) : (
                  <span className="status-icon pending">○</span>
                )}
              </div>
              <div className="module-content">
                <h4 className="module-name">{progress.module.module_name}</h4>
                <p className="module-type">{progress.module.content_type}</p>
              </div>
              <div className="module-actions">
                <button className="start-button">
                  {progress.is_completed ? 'Review' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {enrollment.certificate_url && (
        <div className="certificate-section">
          <h3 className="certificate-title">Your Certificate</h3>
          <div className="certificate-card">
            <div className="certificate-info">
              <h4 className="certificate-name">{enrollment.course.course_name} Certificate</h4>
              <p className="certificate-issue-date">Issued on {formatDate(enrollment.completion_date)}</p>
            </div>
            <a 
              href={enrollment.certificate_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-certificate-button"
            >
              View Certificate
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;