import React from 'react';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import './AttendanceTable.css';

const AttendanceTable = ({ data }) => {
  const attendanceData = data || [
    {
      id: 1,
      name: 'Abbas Hassan',
      role: 'HR Manager',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      overTime: '0h',
      location: 'OnSite'
    },
    {
      id: 2,
      name: 'Rawan Ghobar',
      role: 'Software Engineer',
      status: 'Absent',
      checkIn: '-',
      checkOut: '-',
      overTime: '0h',
      location: 'Remote'
    },
    {
      id: 3,
      name: 'Amir Baddour',
      role: 'Marketing Executive',
      status: 'Late',
      checkIn: '10:15 AM',
      checkOut: '05:00 PM',
      overTime: '0h',
      location: 'OnSite'
    },
    {
      id: 4,
      name: 'Mahmoud Sayed',
      role: 'Financial Analyst',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      overTime: '1h',
      location: 'Remote'
    },
    {
      id: 5,
      name: 'Marwa Tarshishi',
      role: 'Project Manager',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '05:00 PM',
      overTime: '0h',
      location: 'Onsite'
    },
    {
      id: 6,
      name: 'Ali Ahmad',
      role: 'Sales Manager',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '07:00 PM',
      overTime: '2h',
      location: 'OnSite'
    }
  ];

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
          {attendanceData.map((employee) => (
            <tr key={employee.id}>
              <td className="employee-name">{employee.name}</td>
              <td>{employee.role}</td>
              <td>
                <StatusBadge status={employee.status} />
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