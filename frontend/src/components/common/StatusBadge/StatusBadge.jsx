import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      // Attendance statuses
      case 'present':
        return 'status-badge present';
      case 'absent':
        return 'status-badge absent';
      case 'late':
        return 'status-badge late';
      
      // Document statuses
      case 'approved':
        return 'status-badge approved';
      case 'denied':
        return 'status-badge denied';
      case 'pending':
        return 'status-badge pending';
        
      default:
        return 'status-badge';
    }
  };

  return <div className={getStatusClass()}>{status}</div>;
};

export default StatusBadge;