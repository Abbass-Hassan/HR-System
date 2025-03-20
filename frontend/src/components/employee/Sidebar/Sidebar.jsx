import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineDocument } from "react-icons/hi"; 
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

import CrewMateLogo from "../../../assets/images/crewmate-logo.svg";

import "./Sidebar.css";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
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
                activeItem === "dashboard"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleItemClick("dashboard")}
            >
              <RxDashboard className="sidebar__icon" />
              <span>Dashboard</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={
                activeItem === "documents"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleItemClick("documents")}
            >
              <HiOutlineDocument className="sidebar__icon" />
              <span>Documents</span>
            </button>
          </li>
          
          <li className="sidebar__bottom-section">
            <button
              type="button"
              className={
                activeItem === "help"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleItemClick("help")}
            >
              <IoMdHelpCircleOutline className="sidebar__icon" />
              <span>Help</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={
                activeItem === "logout"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              onClick={() => handleItemClick("logout")}
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