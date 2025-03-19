import React from 'react';
import './AttendanceSummaryCard.css';
import officeChairSvg from '../../../assets/images/office-chair.svg';
import alertDiamondSvg from '../../../assets/images/alert-diamond.svg';
import alarmClockSvg from '../../../assets/images/alarm-clock.svg';
import beachSvg from '../../../assets/images/beach.svg';

const AttendanceSummaryCard = ({ title, count, icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'office-chair':
        return <img src={officeChairSvg} alt="Present" className="card-icon" />;
      case 'alert-diamond':
        return <img src={alertDiamondSvg} alt="Absent" className="card-icon" />;
      case 'alarm-clock':
        return <img src={alarmClockSvg} alt="Late" className="card-icon" />;
      case 'beach':
        return <img src={beachSvg} alt="Leave" className="card-icon" />;
      default:
        return <img src={officeChairSvg} alt="Present" className="card-icon" />;
    }
  };

  const getCardClass = () => {
    return `summary-card ${icon}`;
  };

  return (
    <div className={getCardClass()}>
      <div className="icon-wrapper">
        <div className="icon-container">
          {renderIcon()}
        </div>
      </div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <div className="card-count">{count}</div>
      </div>
    </div>
  );
};

export default AttendanceSummaryCard;