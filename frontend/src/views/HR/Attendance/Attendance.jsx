import React from 'react';
import './Attendance.css';
import AttendanceSummaryCard from '../../../components/hr/AttendanceSummaryCard/AttendanceSummaryCard';
import SearchBar from '../../../components/hr/SearchBar/SearchBar';
import FilterButton from '../../../components/hr/FilterButton/FilterButton';
import DateDisplay from '../../../components/hr/DateDisplay/DateDisplay';
import AttendanceTable from '../../../components/hr/AttendanceTable/AttendanceTable';

const Attendance = () => {
  const summaryData = [
    { id: 1, title: 'Present Workforce', count: 125, icon: 'office-chair' },
    { id: 2, title: 'Absent Workforce', count: 15, icon: 'alert-diamond' },
    { id: 3, title: 'Late arrivals', count: 5, icon: 'alarm-clock' },
    { id: 4, title: 'On leave', count: 5, icon: 'beach' }
  ];

  const attendanceData = [
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

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleFilter = () => {
    console.log('Filter button clicked');
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1 className="attendance-title">Employee Attendance</h1>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>

      <div className="summary-cards-container">
        {summaryData.map((card) => (
          <AttendanceSummaryCard
            key={card.id}
            title={card.title}
            count={card.count}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="table-controls-container">
        <SearchBar onSearch={handleSearch} />
        <div className="right-controls">
          <FilterButton onClick={handleFilter} />
          <DateDisplay date={formattedDate} />
        </div>
      </div>

      <AttendanceTable data={attendanceData} />
    </div>
  );
};

export default Attendance;