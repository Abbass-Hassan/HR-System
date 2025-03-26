import React from 'react';
import './RecommendedCourseCard.css';

const RecommendedCourseCard = ({ course, onEnroll }) => {
  const getDefaultLogo = () => {
    const firstLetter = course.course_name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=008080&color=fff&size=80`;
  };

  return (
    <div className="recommended-course-card">
      <div className="recommended-course-logo">
        <img 
          src={course.logo_url || getDefaultLogo()} 
          alt={course.course_name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getDefaultLogo();
          }}
        />
      </div>
      
      <div className="recommended-course-content">
        <h3 className="recommended-course-title">{course.course_name}</h3>
        <p className="recommended-course-description">
          {course.description || 'No description available'}
        </p>
      </div>
      
      <button 
        className="register-button" 
        onClick={(e) => {
          e.stopPropagation();
          onEnroll();
        }}
      >
        Register
      </button>
    </div>
  );
};

export default RecommendedCourseCard;