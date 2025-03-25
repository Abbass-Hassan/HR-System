import React from "react";
import "./RulesCard.css";

function RulesCard() {
  const rules = [
    "Employees must clock in at 9 AM (late if after 9 AM)",
    "Employees must clock out at 6 PM (overtime if after 6 PM)",
    "Employees cannot clock in after 12 PM (must wait for next day)",
    "If not clocked in by 12 PM, employee is marked as absent",
    "If employee doesn't clock out by 10 PM, system will auto clock out at 6 PM (no overtime)",
  ];

  return (
    <div className="rules-card">
      <h3 className="rules-title">Attendance Rules</h3>
      <ul className="rules-list">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}

export default RulesCard;
