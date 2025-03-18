import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsersLine } from "react-icons/fa6";
import { FiUserPlus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlinePayments } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

import CrewMateLogo from "../../../assets/images/crewmate-logo.svg";

import "./Sidebar.css";

function Sidebar() {
  const [activeParent, setActiveParent] = useState("dashboard");
  const [activeSubItem, setActiveSubItem] = useState("");

  const [isEmployeeOpen, setEmployeeOpen] = useState(false);
  const [isRecruitmentOpen, setRecruitmentOpen] = useState(false);
  const [isPayrollOpen, setPayrollOpen] = useState(false);

  const handleParentClick = (parentId) => {
    if (parentId === "employee") {
      setEmployeeOpen(true);
      setRecruitmentOpen(false);
      setPayrollOpen(false);
      setActiveParent("employee");
      setActiveSubItem("attendance");
    } else if (parentId === "recruitment") {
      setRecruitmentOpen(true);
      setEmployeeOpen(false);
      setPayrollOpen(false);
      setActiveParent("recruitment");
      setActiveSubItem("candidates"); 
    } else if (parentId === "payroll") {
      setPayrollOpen(true);
      setEmployeeOpen(false);
      setRecruitmentOpen(false);
      setActiveParent("payroll");
      setActiveSubItem("payslips"); 
    } else {
      setEmployeeOpen(false);
      setRecruitmentOpen(false);
      setPayrollOpen(false);
      setActiveParent(parentId);
      setActiveSubItem("");
    }
  };

  const handleSubItemClick = (parentId, subId) => {
    setActiveParent(parentId);
    setActiveSubItem(subId);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={CrewMateLogo} alt="Crewmate" className="sidebar__logo" />
        <h2 className="sidebar__title">Crewmate</h2>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          <li>
            <button
              type="button"
              className={
                activeParent === "dashboard"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleParentClick("dashboard")}
            >
              <RxDashboard className="sidebar__icon" />
              <span>Dashboard</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`sidebar__link sidebar__link--collapsible ${
                activeParent === "employee" ? "sidebar__link--active" : ""
              }`}
              onClick={() => handleParentClick("employee")}
            >
              <div className="sidebar__link-text">
                <FaUsersLine className="sidebar__icon" />
                <span>Employee</span>
              </div>
              {isEmployeeOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isEmployeeOpen && (
              <ul className="sidebar__submenu">
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "attendance" && activeParent === "employee"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("employee", "attendance")}
                  >
                    <span className="sidebar__bullet" />
                    Attendance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "leave" && activeParent === "employee"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("employee", "leave")}
                  >
                    <span className="sidebar__bullet" />
                    Leave requests
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "documents" && activeParent === "employee"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("employee", "documents")}
                  >
                    <span className="sidebar__bullet" />
                    Documents
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              type="button"
              className={`sidebar__link sidebar__link--collapsible ${
                activeParent === "recruitment" ? "sidebar__link--active" : ""
              }`}
              onClick={() => handleParentClick("recruitment")}
            >
              <div className="sidebar__link-text">
                <FiUserPlus className="sidebar__icon" />
                <span>Recruitment</span>
              </div>
              {isRecruitmentOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isRecruitmentOpen && (
              <ul className="sidebar__submenu">
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "candidates" &&
                      activeParent === "recruitment"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("recruitment", "candidates")}
                  >
                    <span className="sidebar__bullet" />
                    Candidates
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "interviews" &&
                      activeParent === "recruitment"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("recruitment", "interviews")}
                  >
                    <span className="sidebar__bullet" />
                    Interviews
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              type="button"
              className={`sidebar__link sidebar__link--collapsible ${
                activeParent === "payroll" ? "sidebar__link--active" : ""
              }`}
              onClick={() => handleParentClick("payroll")}
            >
              <div className="sidebar__link-text">
                <MdOutlinePayments className="sidebar__icon" />
                <span>Payroll</span>
              </div>
              {isPayrollOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isPayrollOpen && (
              <ul className="sidebar__submenu">
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "payslips" && activeParent === "payroll"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("payroll", "payslips")}
                  >
                    <span className="sidebar__bullet" />
                    Payslips
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={
                      activeSubItem === "bonuses" && activeParent === "payroll"
                        ? "sidebar__sublink sidebar__sublink--active"
                        : "sidebar__sublink"
                    }
                    onClick={() => handleSubItemClick("payroll", "bonuses")}
                  >
                    <span className="sidebar__bullet" />
                    Bonuses
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              type="button"
              className={
                activeParent === "reports"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleParentClick("reports")}
            >
              <TbReportAnalytics className="sidebar__icon" />
              <span>Reports and Analytics</span>
            </button>
          </li>
          <li className="sidebar__bottom-section">
            <button
              type="button"
              className={
                activeParent === "help"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleParentClick("help")}
            >
              <IoMdHelpCircleOutline className="sidebar__icon" />
              <span>Help</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={
                activeParent === "logout"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleParentClick("logout")}
            >
              <TbLogout2 className="sidebar__icon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
