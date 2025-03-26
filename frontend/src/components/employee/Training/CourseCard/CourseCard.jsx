import React, { useState, useRef } from 'react';
import './CourseCard.css';
import { FiMoreVertical } from 'react-icons/fi';

const CourseCard = ({ course, progress, onContinue, onViewDetails, onQuit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleContinue = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onContinue) onContinue();
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onViewDetails) onViewDetails();
  };

  const handleQuit = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to quit this course? Your progress will be saved.')) {
      setShowMenu(false);
      if (onQuit) onQuit();
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDefaultLogo = () => {
    const firstLetter = course.course_name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=008080&color=fff&size=60`;
  };

  return (
    <div className="course-card" onClick={onContinue}>
      <div className="course-card-header">
        <div className="course-logo">
          <img 
            src={course.logo_url || getDefaultLogo()} 
            alt={course.course_name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getDefaultLogo();
            }}
          />
        </div>
        <div className="course-menu-container" ref={menuRef}>
          <button className="course-menu-button" onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}>
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="course-menu-dropdown">
              <button onClick={handleContinue}>Continue</button>
              <button onClick={handleViewDetails}>Detailed Progress</button>
              <button onClick={handleQuit} className="quit-option">Quit Course</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="course-info">
        <h3 className="course-title">{course.course_name}</h3>
        
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;