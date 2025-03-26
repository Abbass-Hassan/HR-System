import React, { useState, useRef, useEffect } from 'react';
import './EmployeeLeaveCard.css';
import { FiMoreVertical, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import defaultProfileImage from '../../../assets/images/rechardHendricks.jpg';
import LeaveHistoryTable from '../../common/LeaveHistoryTable/LeaveHistoryTable';

const EmployeeLeaveCard = ({ employee, onApprove, onReject }) => {
  const [showActions, setShowActions] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const toggleExpanded = () => {
    setCardExpanded(!cardExpanded);
  };

  const handleViewHistory = () => {
    toggleExpanded();
    setShowActions(false);
  };

  const handleApprove = () => {
    if (employee.time_off_summary && onApprove) {
      onApprove(employee.time_off_summary.id);
    }
    setShowActions(false);
  };

  const handleReject = () => {
    if (employee.time_off_summary && onReject) {
      onReject(employee.time_off_summary.id);
    }
    setShowActions(false);
  };

  // Get profile image URL or fallback to default
  const getProfileImage = () => {
    if (employee.profile_image) {
      return 'http://localhost:8000/' + employee.profile_image;
    }
    return defaultProfileImage;
  };

  return (
    <div className={`employee-card ${cardExpanded ? 'expanded-card' : ''}`}>
      <div className="card-header">
        <div className="employee-info">
          <img 
            src={getProfileImage()} 
            alt={employee.name} 
            className="employee-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=008080&color=fff`;
            }}
          />
          <div className="employee-details">
            <div className="name-section">
              <h3 className="detail-label">Name</h3>
              <p className="detail-value">{employee.name}</p>
            </div>
            <div className="role-section">
              <h3 className="detail-label">Role</h3>
              <p className="detail-value">{employee.role}</p>
            </div>
          </div>
        </div>
        <div className="card-controls">
          <div className="actions-container" ref={actionsRef}>
            <button className="options-button" onClick={toggleActions}>
              <FiMoreVertical size={20} />
            </button>
            {showActions && (
              <div className="actions-dropdown">
                <button onClick={handleViewHistory}>View Leave History</button>
                {employee.time_off_summary && employee.time_off_summary.status === 'pending' && (
                  <>
                    <button onClick={handleApprove} className="approve-action">Approve Request</button>
                    <button onClick={handleReject} className="reject-action">Reject Request</button>
                  </>
                )}
              </div>
            )}
          </div>
          <button className="expand-button" onClick={toggleExpanded}>
            {cardExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </button>
        </div>
      </div>

      {employee.time_off_summary && (
        <div className="timeoff-summary">
          <h3 className="summary-title">Time Off Summary</h3>
          <div className="timeoff-details">
            <div className="detail-row">
              <span className="detail-label">Leave Type</span>
              <span className="detail-label">Duration</span>
              <span className="detail-label">Date From</span>
              <span className="detail-label">Date To</span>
            </div>
            <div className="data-row">
              <span className="data-value">{employee.time_off_summary.leave_type}</span>
              <span className="data-value">{employee.time_off_summary.duration}</span>
              <span className="data-value">{employee.time_off_summary.date_from}</span>
              <span className="data-value">{employee.time_off_summary.date_to}</span>
            </div>
          </div>

          {employee.time_off_summary.status && (
            <div className="status-wrapper">
              <StatusBadge status={employee.time_off_summary.status} />
            </div>
          )}
          
          {employee.time_off_summary.status === 'pending' && (
            <div className="request-actions">
              <button 
                className="accept-button" 
                onClick={() => onApprove(employee.time_off_summary.id)}
              >
                Accept
              </button>
              <button 
                className="reject-button" 
                onClick={() => onReject(employee.time_off_summary.id)}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}

      {cardExpanded && (
        <div className="expanded-content">
          <div className="leave-history">
            <h3 className="history-title">Leave History</h3>
            <LeaveHistoryTable leaveHistory={employee.leave_history} />
          </div>
          
          <div className="statistics-cards">
            <div className="stat-card available-days">
              <h4 className="stat-number">{employee.statistics.days_available}</h4>
              <p className="stat-title">Days Available</p>
              <p className="stat-subtitle">To Issue Time Off</p>
            </div>
            <div className="stat-card pending-requests">
              <h4 className="stat-number">{employee.statistics.pending_requests}</h4>
              <p className="stat-title">Pending Request</p>
              <p className="stat-subtitle">Awaiting Manager Approval</p>
            </div>
            <div className="stat-card upcoming-days">
              <h4 className="stat-number">{employee.statistics.upcoming_days}</h4>
              <p className="stat-title">Days Upcoming</p>
              <p className="stat-subtitle">{employee.statistics.upcoming_days} Days Taken</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveCard;