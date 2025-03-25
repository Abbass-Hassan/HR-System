import React, { useState, useEffect } from 'react';
import './Attendance.css';
import AttendanceSummaryCard from '../../../components/hr/AttendanceSummaryCard/AttendanceSummaryCard';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import AttendanceTable from '../../../components/hr/AttendanceTable/AttendanceTable';
import axios from 'axios';

// Set the correct backend URL
const API_BASE_URL = 'http://localhost:8001';

const Attendance = () => {
  // Initialize state
  const [summaryData, setSummaryData] = useState([
    { id: 1, title: 'Present Workforce', count: 0, icon: 'office-chair' },
    { id: 2, title: 'Absent Workforce', count: 0, icon: 'alert-diamond' },
    { id: 3, title: 'Late arrivals', count: 0, icon: 'alarm-clock' },
    { id: 4, title: 'On leave', count: 0, icon: 'beach' }
  ]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch attendance data when component mounts or date changes
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  // Format role based on account_type
  const formatRoleLabel = (accountType) => {
    if (accountType === 'hr') {
      return 'HR';
    } else if (accountType === 'employee') {
      return 'Employee';
    }
    return 'Unknown';
  };

  // Safe function to format time with fallbacks
  const formatTimeString = (timeString) => {
    if (!timeString) return '-';
    
    try {
      // Try to extract hours and minutes more carefully
      // This handles multiple possible timestamp formats
      let hours, minutes;
      
      // For format like "2025-03-25T09:00:00.000000Z"
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1];
        [hours, minutes] = timePart.split(':').map(Number);
      } 
      // For format like "2025-03-25 09:00:00"
      else if (timeString.includes(' ')) {
        const timePart = timeString.split(' ')[1];
        [hours, minutes] = timePart.split(':').map(Number);
      } 
      // Direct format like "09:00:00"
      else if (timeString.includes(':')) {
        [hours, minutes] = timeString.split(':').map(Number);
      }
      // Fall back to using Date object for any other format
      else {
        const date = new Date(timeString);
        hours = date.getHours();
        minutes = date.getMinutes();
      }
      
      // If we have valid hours and minutes, format them
      if (!isNaN(hours) && !isNaN(minutes)) {
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes < 10 ? '0' + minutes : minutes}${hours >= 12 ? ' PM' : ' AM'}`;
      }
      
      // If parsing failed, return the original string
      return timeString;
    } catch (e) {
      console.error('Error formatting time:', e, timeString);
      return timeString; // Return original if parsing fails
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Format date for API (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Fetching attendance for date:', formattedDate);
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/admin/attendance`, {
        params: { date: formattedDate },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);
      
      // Handle the attendance data
      if (response.data.attendances && response.data.attendances.length > 0) {
        // Log all statuses for debugging
        console.log('Status values:', response.data.attendances.map(a => a.status));
        
        const formattedAttendance = response.data.attendances.map(record => {
          // Log the raw time values for debugging
          console.log('Raw clock_in:', record.clock_in);
          console.log('Raw clock_out:', record.clock_out);
          
          return {
            id: record.id,
            name: record.user ? `${record.user.first_name} ${record.user.last_name}` : `User ${record.user_id}`,
            role: record.user ? formatRoleLabel(record.user.account_type) : 'Unknown',
            status: record.status || 'Unknown',
            checkIn: formatTimeString(record.clock_in),
            checkOut: formatTimeString(record.clock_out),
            overTime: record.total_hours > 8 ? `${Math.floor(record.total_hours - 8)}h` : '0h',
            location: record.location_status || 'Unknown'
          };
        });
        
        setAttendanceData(formattedAttendance);
        
        // Calculate summary data directly from the attendance records
        // First normalize status values (case-insensitive comparison)
        const normalizedAttendances = response.data.attendances.map(a => ({
          ...a,
          normalizedStatus: a.status ? a.status.toLowerCase().trim() : 'unknown'
        }));
        
        // Count records for each status
        const presentCount = normalizedAttendances.filter(a => a.normalizedStatus === 'present').length;
        const lateCount = normalizedAttendances.filter(a => a.normalizedStatus === 'late').length;
        const absentCount = normalizedAttendances.filter(a => a.normalizedStatus === 'absent').length;
        
        // Get on leave count from the API, or default to 0
        const onLeaveCount = response.data.summary?.on_leave || 0;
        
        console.log('Calculated attendance counts:', {
          present: presentCount,
          late: lateCount,
          absent: absentCount,
          onLeave: onLeaveCount,
          total: normalizedAttendances.length
        });
        
        // Update summary cards with calculated values
        const newSummaryData = [
          { id: 1, title: 'Present Workforce', count: presentCount, icon: 'office-chair' },
          { id: 2, title: 'Absent Workforce', count: absentCount, icon: 'alert-diamond' },
          { id: 3, title: 'Late arrivals', count: lateCount, icon: 'alarm-clock' },
          { id: 4, title: 'On leave', count: onLeaveCount, icon: 'beach' }
        ];
        
        setSummaryData(newSummaryData);
      } else {
        setAttendanceData([]);
        
        // Reset summary counts when no data
        setSummaryData([
          { id: 1, title: 'Present Workforce', count: 0, icon: 'office-chair' },
          { id: 2, title: 'Absent Workforce', count: 0, icon: 'alert-diamond' },
          { id: 3, title: 'Late arrivals', count: 0, icon: 'alarm-clock' },
          { id: 4, title: 'On leave', count: 0, icon: 'beach' }
        ]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data. ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = () => {
    console.log('Filter button clicked');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const currentDate = selectedDate;
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Filter data based on search term
  const filteredData = searchTerm 
    ? attendanceData.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : attendanceData;

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
          <DateDisplay 
            date={formattedDate} 
            isSelectable={true}
            onDateChange={handleDateChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading attendance data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : attendanceData.length > 0 ? (
        <AttendanceTable data={filteredData} loading={loading} />
      ) : (
        <div className="empty-message">No attendance records found for this date.</div>
      )}
    </div>
  );
};

export default Attendance;