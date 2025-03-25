import React from "react";
import "./TimeCard.css";

function TimeCard({ currentTime }) {
  return (
    <div className="time-card">
      <h2>
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </h2>
      <h3>
        {currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </h3>
    </div>
  );
}

export default TimeCard;
