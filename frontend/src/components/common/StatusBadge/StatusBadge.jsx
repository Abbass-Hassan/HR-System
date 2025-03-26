import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      // Leave request statuses
      case 'approved':
        return 'status-badge approved';
      case 'rejected':
        return 'status-badge rejected';
      case 'pending':
        return 'status-badge pending';
      case 'cancelled':
        return 'status-badge cancelled';
        
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
      case 'rejected':
        return 'status-badge rejected';
      case 'pending':
        return 'status-badge pending';
        
      default:
        return 'status-badge';
    }
  };

  return <div className={getStatusClass()}>{status}</div>;
};

export default StatusBadge;