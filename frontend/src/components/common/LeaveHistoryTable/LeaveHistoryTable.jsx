import React from 'react';
import './LeaveHistoryTable.css';
import StatusBadge from '../StatusBadge/StatusBadge';

const LeaveHistoryTable = ({ leaveHistory, loading }) => {
  if (loading) {
    return <div className="loading-indicator">Loading leave history...</div>;
  }

  if (!leaveHistory || leaveHistory.length === 0) {
    return <div className="no-history">No leave history found.</div>;
  }

  return (
    <div className="leave-history-table-container">
      <table className="leave-history-table">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Duration</th>
            <th>Date From</th>
            <th>Date To</th>
            <th>Status</th>
            <th>Requested On</th>
          </tr>
        </thead>
        <tbody>
          {leaveHistory.map(leave => (
            <tr key={leave.id}>
              <td>{leave.leave_type}</td>
              <td>{leave.total_days} day(s)</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>
                <StatusBadge status={leave.status} />
              </td>
              <td>{leave.requested_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistoryTable;