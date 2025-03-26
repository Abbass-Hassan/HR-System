import React from 'react';
import './LeaveStatisticsCards.css';

const LeaveStatisticsCards = ({ statistics, loading }) => {
  if (loading) {
    return (
      <div className="statistics-container">
        <div className="statistic-card days-available skeleton"></div>
        <div className="statistic-card pending-requests skeleton"></div>
        <div className="statistic-card upcoming-days skeleton"></div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <div className="statistic-card days-available">
        <h2 className="statistic-value">{statistics.days_available}</h2>
        <h3 className="statistic-title">Days Available</h3>
        <p className="statistic-subtitle">To Book Time Off</p>
      </div>
      
      <div className="statistic-card pending-requests">
        <h2 className="statistic-value">{statistics.pending_requests}</h2>
        <h3 className="statistic-title">Pending Request</h3>
        <p className="statistic-subtitle">Awaiting Manager Approval</p>
      </div>
      
      <div className="statistic-card upcoming-days">
        <h2 className="statistic-value">{statistics.upcoming_days}</h2>
        <h3 className="statistic-title">Days Upcoming</h3>
        <p className="statistic-subtitle">{statistics.upcoming_days} Days Taken</p>
      </div>
    </div>
  );
};

export default LeaveStatisticsCards;