import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

// Set the correct backend URL here
const API_BASE_URL = 'http://localhost:8001';

function Dashboard() {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch current attendance status when component mounts
  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      console.log("Using token:", token); // Debug log
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/attendance/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("API Response:", response.data); // Debug log
      setAttendanceStatus(response.data);
      setMessage(null); // Clear any previous messages
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance status:', err);
      setError('Failed to load attendance status.');
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setMessage(null); // Clear previous messages
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the API call
      const response = await axios.post(`${API_BASE_URL}/api/v0.1/attendance/clock-in`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Clock In Response:", response.data); // Debug log
      
      setMessage({ type: 'success', text: response.data.message || 'Successfully clocked in.' });
      fetchAttendanceStatus(); // Refresh the status
    } catch (err) {
      console.error('Error clocking in:', err);
      const errorMessage = err.response?.data?.message || 'Failed to clock in.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleClockOut = async () => {
    try {
      setMessage(null); // Clear previous messages
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the API call
      const response = await axios.post(`${API_BASE_URL}/api/v0.1/attendance/clock-out`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Clock Out Response:", response.data); // Debug log
      
      setMessage({ type: 'success', text: response.data.message || 'Successfully clocked out.' });
      fetchAttendanceStatus(); // Refresh the status
    } catch (err) {
      console.error('Error clocking out:', err);
      const errorMessage = err.response?.data?.message || 'Failed to clock out.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      
      <div className="time-card">
        <h2>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
        <h3>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h3>
      </div>

      <div className="attendance-card">
        <h3 className="attendance-title">Attendance Status</h3>
        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="status-info">
            {attendanceStatus?.attendance?.clock_in ? (
              <>
                <p className={`status-text ${attendanceStatus.attendance.status || 'present'}`}>
                  Status: {attendanceStatus.attendance.status || 'Present'}
                </p>
                <p>Clocked in: {new Date(attendanceStatus.attendance.clock_in).toLocaleTimeString()}</p>
                {attendanceStatus.attendance.clock_out && (
                  <p>Clocked out: {new Date(attendanceStatus.attendance.clock_out).toLocaleTimeString()}</p>
                )}
              </>
            ) : (
              <p>You haven't clocked in today.</p>
            )}
          </div>
        )}
        
        {/* Clock in/out buttons */}
        <div className="attendance-buttons">
          {(!attendanceStatus?.attendance?.clock_in) && (
            <button 
              className="clock-in-btn" 
              onClick={handleClockIn}
              disabled={loading}
            >
              Clock In
            </button>
          )}
          
          {(attendanceStatus?.attendance?.clock_in && !attendanceStatus?.attendance?.clock_out) && (
            <button 
              className="clock-out-btn" 
              onClick={handleClockOut}
              disabled={loading}
            >
              Clock Out
            </button>
          )}
        </div>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;