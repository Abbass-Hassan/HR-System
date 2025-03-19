import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'status-badge present';
      case 'absent':
        return 'status-badge absent';
      case 'late':
        return 'status-badge late';
      default:
        return 'status-badge';
    }
  };

  return <div className={getStatusClass()}>{status}</div>;
};

export default StatusBadge;