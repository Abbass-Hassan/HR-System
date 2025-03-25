import React from 'react';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import './AttendanceTable.css';

const AttendanceTable = ({ data, loading }) => {
  // Show loading state if loading prop is true
  if (loading) {
    return (
      <div className="attendance-table-container">
        <div className="loading-message">Loading attendance data...</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <div className="attendance-table-container">
        <div className="empty-message">No attendance records found for this date.</div>
      </div>
    );
  }

  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Over Time</th>
            <th>Location Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <tr key={employee.id}>
              <td className="employee-name">{employee.name}</td>
              <td>{employee.role}</td>
              <td>
                <StatusBadge status={employee.status.toLowerCase()} />
              </td>
              <td>{employee.checkIn}</td>
              <td>{employee.checkOut}</td>
              <td>{employee.overTime}</td>
              <td>{employee.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;