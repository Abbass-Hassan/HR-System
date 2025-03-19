import React from 'react';
import './DateDisplay.css';
import calendarSvg from '../../../assets/images/calendar.svg';

const DateDisplay = ({ date, className = '' }) => {
  const formatDate = (dateString) => {
    if (!dateString) {
      const today = new Date();
      return today.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`date-display-container ${className}`}>
      <img src={calendarSvg} alt="Calendar" className="calendar-icon" />
      <span className="date-text">{formatDate(date)}</span>
    </div>
  );
};

export default DateDisplay;