import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TrainingDashboard.css';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import CourseCard from '../../../components/employee/Training/CourseCard/CourseCard';
import RecommendedCourseCard from '../../../components/employee/Training/RecommendedCourseCard/RecommendedCourseCard';

const API_BASE_URL = 'http://localhost:8000';

const TrainingDashboard = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch my enrolled courses
      const enrollmentsResponse = await axios.get(`${API_BASE_URL}/api/v0.1/training/enrollments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch featured courses (as recommended)
      const recommendedResponse = await axios.get(`${API_BASE_URL}/api/v0.1/training/courses/featured`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch available courses
      const availableResponse = await axios.get(`${API_BASE_URL}/api/v0.1/training/courses/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (enrollmentsResponse.data.success) {
        setMyCourses(enrollmentsResponse.data.enrollments);
      }
      
      if (recommendedResponse.data.success) {
        setRecommendedCourses(recommendedResponse.data.courses);
      }
      
      if (availableResponse.data.success) {
        setAvailableCourses(availableResponse.data.courses);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching training data:', err);
      setError('Failed to load training data. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/training/courses/search?q=${term}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSearchResults(response.data.courses);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching courses:', err);
      setSearchResults([]);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_BASE_URL}/api/v0.1/training/courses/${courseId}/enroll`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Refresh data to show the newly enrolled course
        fetchTrainingData();
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
    }
  };

  const handleContinueCourse = (enrollmentId) => {
    navigate(`/employee/training/course/${enrollmentId}`);
  };

  return (
    <div className="training-dashboard">
      <PageHeader 
        title="Training & Development" 
        subTitle="Employee" 
        subSubTitle="Courses" 
      />
      
      <div className="training-search">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for courses..."
        />
      </div>
      
      <div className="training-content">
        <div className="my-courses-section">
          <h2 className="section-title">My Courses</h2>
          {loading ? (
            <div className="loading-indicator">Loading your courses...</div>
          ) : myCourses.length > 0 ? (
            <div className="my-courses-grid">
              {myCourses.map(enrollment => (
                <CourseCard 
                  key={enrollment.id}
                  course={enrollment.course}
                  progress={enrollment.completion_percentage}
                  onContinue={() => handleContinueCourse(enrollment.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              You are not enrolled in any courses yet. Browse the available courses to get started.
            </div>
          )}
        </div>
        
        <div className="recommended-section">
          <h2 className="section-title">
            {isSearching ? 'Search Results' : 'Recommended Courses'}
          </h2>
          {loading ? (
            <div className="loading-indicator">Loading courses...</div>
          ) : isSearching ? (
            searchResults.length > 0 ? (
              <div className="recommended-courses-carousel">
                {searchResults.map(course => (
                  <RecommendedCourseCard 
                    key={course.id}
                    course={course}
                    onEnroll={() => handleEnroll(course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No courses found matching your search.
              </div>
            )
          ) : (
            recommendedCourses.length > 0 ? (
              <div className="recommended-courses-carousel">
                {recommendedCourses.map(course => (
                  <RecommendedCourseCard 
                    key={course.id}
                    course={course}
                    onEnroll={() => handleEnroll(course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No recommended courses available at this time.
              </div>
            )
          )}
        </div>
        
        <div className="available-courses-section">
          <h2 className="section-title">Available Courses</h2>
          {loading ? (
            <div className="loading-indicator">Loading available courses...</div>
          ) : availableCourses.length > 0 ? (
            <div className="available-courses-carousel">
              {availableCourses.map(course => (
                <RecommendedCourseCard 
                  key={course.id}
                  course={course}
                  onEnroll={() => handleEnroll(course.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No additional courses available at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;