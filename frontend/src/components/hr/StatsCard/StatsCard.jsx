import React from 'react';
import './StatsCard.css';

const StatsCard = ({ count, title, subtitle, color = 'teal' }) => {
  const colorClasses = {
    teal: 'color-teal',
    blue: 'color-blue',
    gray: 'color-gray',
  };

  return (
    <div className={`stat-card ${colorClasses[color] || ''}`}>
      <div className="count">{count}</div>
      <div className="info">
        <h3 className="title">{title}</h3>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;