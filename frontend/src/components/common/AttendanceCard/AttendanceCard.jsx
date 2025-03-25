import React from "react";
import "./AttendanceCard.css";

function AttendanceCard({
  attendanceStatus,
  loading,
  error,
  handleClockIn,
  handleClockOut,
  message,
}) {
  return (
    <div className="card attendance-card">
      <h3 className="attendance-title">Attendance Status</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="status-info">
          {attendanceStatus?.attendance?.clock_in ? (
            <>
              <p
                className={`status-text ${
                  attendanceStatus.attendance.status || "present"
                }`}
              >
                Status: {attendanceStatus.attendance.status || "Present"}
              </p>
              <p>
                Clocked in:{" "}
                {new Date(
                  attendanceStatus.attendance.clock_in
                ).toLocaleTimeString()}
              </p>
              {attendanceStatus.attendance.clock_out && (
                <p>
                  Clocked out:{" "}
                  {new Date(
                    attendanceStatus.attendance.clock_out
                  ).toLocaleTimeString()}
                </p>
              )}
            </>
          ) : (
            <p>You haven't clocked in today.</p>
          )}
        </div>
      )}

      <div className="attendance-buttons">
        {!attendanceStatus?.attendance?.clock_in && (
          <button
            className="clock-in-btn"
            onClick={handleClockIn}
            disabled={loading}
          >
            Clock In
          </button>
        )}

        {attendanceStatus?.attendance?.clock_in &&
          !attendanceStatus?.attendance?.clock_out && (
            <button
              className="clock-out-btn"
              onClick={handleClockOut}
              disabled={loading}
            >
              Clock Out
            </button>
          )}
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}

export default AttendanceCard;
