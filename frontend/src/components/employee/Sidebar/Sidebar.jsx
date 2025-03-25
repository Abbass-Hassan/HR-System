import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineDocument } from "react-icons/hi"; 
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { CgProfile } from 'react-icons/cg';
import CrewMateLogo from '../../../assets/images/crewmate-logo.svg';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/employee' && currentPath === '/employee') {
      return true;
    }
    if (path !== '/employee' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <aside className='sidebar'>
      <div className='sidebar__brand'>
        <img
          src={CrewMateLogo}
          alt='Crewmate'
          className='sidebar__logo'
        />
        <h2 className='sidebar__title'>Crewmate</h2>
      </div>
      <nav className='sidebar__nav'>
        <ul className='sidebar__menu'>
          <li>
            <button
              type='button'
              className={
                isActive('/employee')
                  ? 'sidebar__link sidebar__link--active'
                  : 'sidebar__link'
              }
              onClick={() => handleItemClick('/employee')}
            >
              <RxDashboard className='sidebar__icon' />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              type='button'
              className={
                isActive('/employee/profile')
                  ? 'sidebar__link sidebar__link--active'
                  : 'sidebar__link'
              }
              onClick={() => handleItemClick('/employee/profile')}
            >
              <CgProfile className='sidebar__icon' />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button
              type='button'
              className={
                isActive('/employee/documents')
                  ? 'sidebar__link sidebar__link--active'
                  : 'sidebar__link'
              }
              onClick={() => handleItemClick('/employee/documents')}
            >
              <HiOutlineDocument className='sidebar__icon' />
              <span>Documents</span>
            </button>
          </li>
          <li className='sidebar__bottom-section'>
            <button
              type='button'
              className={
                isActive('/employee/help')
                  ? 'sidebar__link sidebar__link--active'
                  : 'sidebar__link'
              }
              onClick={() => handleItemClick('/employee/help')}
            >
              <IoMdHelpCircleOutline className='sidebar__icon' />
              <span>Help</span>
            </button>
          </li>
          <li>
            <button
              type='button'
              className='sidebar__link'
              onClick={() => {
                // Handle logout logic here
                // Example: authService.logout();
                // Then navigate to login page
                handleItemClick('/login');
              }}
            >
              <TbLogout2 className='sidebar__icon' />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;