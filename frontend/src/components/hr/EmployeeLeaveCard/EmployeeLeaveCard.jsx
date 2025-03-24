import React, { useState, useRef, useEffect } from 'react';
import './EmployeeLeaveCard.css';
import { FiMoreVertical } from 'react-icons/fi';

const EmployeeLeaveCard = ({ employee }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(
    employee.leaveRequests && employee.leaveRequests.length > 0 
      ? employee.leaveRequests[0] 
      : null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleViewHistory = () => {
    // Implement view history functionality
    console.log('View history for', employee.name);
    setShowDropdown(false);
  };

  const handleApprove = () => {
    // Implement approve functionality
    console.log('Approve leave for', employee.name);
    setShowDropdown(false);
  };

  const handleReject = () => {
    // Implement reject functionality
    console.log('Reject leave for', employee.name);
    setShowDropdown(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="employee-info">
          <img 
            src={employee.avatar} 
            alt={employee.name} 
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=008080&color=fff`;
            }}
          />
          <div className="info-details">
            <div className="name-section">
              <h3 className="label">Name</h3>
              <p className="value">{employee.name}</p>
            </div>
            <div className="role-section">
              <h3 className="label">Role</h3>
              <p className="value">{employee.role}</p>
            </div>
          </div>
        </div>
        <div className="menu-container" ref={dropdownRef}>
          <button className="menu-button" onClick={toggleDropdown}>
            <FiMoreVertical size={20} />
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleViewHistory}>View Leave History</button>
              <button onClick={handleApprove} className="approve-action">Approve Request</button>
              <button onClick={handleReject} className="reject-action">Reject Request</button>
            </div>
          )}
        </div>
      </div>

      {currentRequest && (
        <div className="time-off-section">
          <h3 className="section-title">Time Off Summary</h3>
          <div className="time-off-details">
            <div className="detail-row">
              <span className="detail-label">Leave Type</span>
              <span className="detail-label">Duration</span>
              <span className="detail-label">Date From</span>
              <span className="detail-label">Date To</span>
            </div>
            <div className="data-row">
              <span className="data-value">{currentRequest.leaveType}</span>
              <span className="data-value">{currentRequest.duration}</span>
              <span className="data-value">{currentRequest.dateFrom}</span>
              <span className="data-value">{currentRequest.dateTo}</span>
            </div>
          </div>

          {currentRequest.status && (
            <div className={`status-badge status-${currentRequest.status.toLowerCase()}`}>
              <span>{currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveCard;