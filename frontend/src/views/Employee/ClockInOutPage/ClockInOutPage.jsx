import React, { useState, useEffect } from "react";
import api from "../../../services/Api.js";

import RulesCard from "../../../components/common/RulesCard/RulesCard";
import AttendanceCard from "../../../components/common/AttendanceCard/AttendanceCard";
import TimeCard from "../../../components/common/TimeCard/TimeCard";
import "./ClockInOutPage.css"; // <-- Updated CSS import name

function ClockInOutPage() {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v0.1/attendance/status");
      setAttendanceStatus(response.data);
      setMessage(null);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching attendance status:", err);
      setError("Failed to load attendance status.");
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setMessage(null);
      const response = await api.post(
        "/api/v0.1/attendance/clock-in",
        {}
      );
      setMessage({
        type: "success",
        text: response.data.message || "Successfully clocked in.",
      });
      fetchAttendanceStatus();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to clock in.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  const handleClockOut = async () => {
    try {
      setMessage(null);
      const response = await api.post(
        "/api/v0.1/attendance/clock-out",
        {}
      );
      setMessage({
        type: "success",
        text: response.data.message || "Successfully clocked out.",
      });
      fetchAttendanceStatus();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to clock out.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <div className="clock-page">
      <h1>Clock In/Out</h1>

      <div className="clock-page-vertical">
        <TimeCard currentTime={currentTime} />

        <AttendanceCard
          attendanceStatus={attendanceStatus}
          loading={loading}
          error={error}
          handleClockIn={handleClockIn}
          handleClockOut={handleClockOut}
          message={message}
        />

        <RulesCard />
      </div>
    </div>
  );
}

export default ClockInOutPage;