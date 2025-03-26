import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import { useToast } from '../../../context/Toast/Toast';
import Layout from '../../../components/hr/Layout/Layout';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import EmployeeLeaveCard from '../../../components/hr/EmployeeLeaveCard/EmployeeLeaveCard';
import StatsCard from '../../../components/hr/StatsCard/StatsCard';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [statistics, setStatistics] = useState({
    days_available: 0,
    pending_requests: 0,
    upcoming_days: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: '',
    leaveType: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveStatistics();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      let url = '/api/v0.1/admin/leave/pending';
      
      // Apply filters if any are set
      if (filterOptions.status || filterOptions.leaveType || filterOptions.dateFrom || filterOptions.dateTo) {
        url = '/api/v0.1/admin/leave?';
        
        if (filterOptions.status) {
          url += `status=${filterOptions.status}&`;
        }
        
        if (filterOptions.leaveType) {
          url += `leave_type=${filterOptions.leaveType}&`;
        }
        
        if (filterOptions.dateFrom) {
          url += `start_date=${filterOptions.dateFrom}&`;
        }
        
        if (filterOptions.dateTo) {
          url += `end_date=${filterOptions.dateTo}&`;
        }
      }
      
      const response = await api.get(url);
      
      if (response.data.success) {
        // Transform API data to match the component structure
        const transformedData = transformEmployeeData(response.data.leave_requests);
        setEmployees(transformedData);
        setError(null);
      } else {
        setError('Failed to load leave requests');
      }
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to load leave requests. Please try again.');
      showToast('Error', 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveStatistics = async () => {
    try {
      const response = await api.get('/api/v0.1/admin/leave/statistics');
      
      if (response.data.success) {
        const stats = response.data.statistics;
        
        setStatistics({
          days_available: 14, // Default annual leave days
          pending_requests: stats.leave_by_status?.pending || 0,
          upcoming_days: stats.leave_by_status?.approved || 0
        });
      }
    } catch (err) {
      console.error('Error fetching leave statistics:', err);
    }
  };

  const transformEmployeeData = (leaveRequests) => {
    // Group leave requests by user
    const userLeaveMap = {};
    
    leaveRequests.forEach(request => {
      if (!request.user) return;
      
      const userId = request.user.id;
      
      if (!userLeaveMap[userId]) {
        userLeaveMap[userId] = {
          id: userId,
          name: `${request.user.first_name} ${request.user.last_name}`,
          role: request.user.position_id ? `Position ID: ${request.user.position_id}` : 'Employee',
          time_off_summary: null,
          leave_history: [],
          statistics: {
            days_available: 14, // Default
            pending_requests: 0,
            upcoming_days: 0
          }
        };
      }
      
      // Add to time_off_summary if it's pending and not already set
      if (request.status === 'pending' && !userLeaveMap[userId].time_off_summary) {
        userLeaveMap[userId].time_off_summary = {
          id: request.id,
          leave_type: request.leave_type,
          duration: `${request.total_days} day(s)`,
          date_from: request.start_date,
          date_to: request.end_date,
          status: request.status
        };
      }
      
      // Add to leave history
      userLeaveMap[userId].leave_history.push({
        id: request.id,
        leave_type: request.leave_type,
        duration: `${request.total_days} day(s)`,
        date_from: request.start_date,
        date_to: request.end_date,
        status: request.status
      });
      
      // Update statistics
      if (request.status === 'pending') {
        userLeaveMap[userId].statistics.pending_requests++;
      } else if (request.status === 'approved') {
        userLeaveMap[userId].statistics.upcoming_days += request.total_days;
      }
    });
    
    return Object.values(userLeaveMap);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    fetchLeaveRequests();
    setShowFilterModal(false);
  };

  const handleApproveLeave = async (id) => {
    try {
      const response = await api.post(`/api/v0.1/admin/leave/${id}/approve`);
      
      if (response.data.success) {
        showToast('Success', 'Leave request approved successfully');
        fetchLeaveRequests();
        fetchLeaveStatistics();
      }
    } catch (err) {
      showToast('Error', err.response?.data?.message || 'Failed to approve leave request');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      // In a real implementation, you would prompt for rejection reason
      const rejectionReason = prompt('Please provide a reason for rejecting this leave request:');
      
      if (!rejectionReason) return;
      
      const response = await api.post(`/api/v0.1/admin/leave/${id}/reject`, {
        rejection_reason: rejectionReason
      });
      
      if (response.data.success) {
        showToast('Success', 'Leave request rejected successfully');
        fetchLeaveRequests();
        fetchLeaveStatistics();
      }
    } catch (err) {
      showToast('Error', err.response?.data?.message || 'Failed to reject leave request');
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const statsData = [
    {
      id: 1,
      count: statistics.days_available,
      title: 'Days Available',
      subtitle: 'To Issue Time Off',
      color: 'teal'
    },
    {
      id: 2,
      count: statistics.pending_requests,
      title: 'Pending Request',
      subtitle: 'Awaiting Manager Approval',
      color: 'blue'
    },
    {
      id: 3,
      count: statistics.upcoming_days,
      title: 'Days Upcoming',
      subtitle: `${statistics.upcoming_days} Days Taken`,
      color: 'gray'
    }
  ];

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div className="title-area">
            <h1 className="main-title">Leave Management</h1>
            <div className="breadcrumbs">
              <span>Employee</span>
              <span className="separator">›</span>
              <span className="active">Leave requests</span>
            </div>
          </div>
          <DateDisplay date={new Date()} className="header-date" />
        </div>

        <div className="page-content">
          <div className="top-actions">
            <div className="search-area">
              <SearchBar onSearch={handleSearch} />
              <button 
                className="view-all-button"
                onClick={() => {
                  setFilterOptions({
                    status: '',
                    leaveType: '',
                    dateFrom: '',
                    dateTo: ''
                  });
                  fetchLeaveRequests();
                }}
              >
                View All
              </button>
              <FilterButton onClick={handleFilter} />
            </div>
            <div className="stats-row">
              {statsData.map((stat) => (
                <StatsCard
                  key={stat.id}
                  count={stat.count}
                  title={stat.title}
                  subtitle={stat.subtitle}
                  color={stat.color}
                />
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-message">Loading leave requests...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={fetchLeaveRequests} className="retry-button">
                Retry
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="no-data">No leave requests found matching your criteria.</div>
          ) : (
            <div className="employee-cards">
              {filteredEmployees.map((employee) => (
                <EmployeeLeaveCard 
                  key={employee.id} 
                  employee={employee}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              ))}
            </div>
          )}
        </div>

        {showFilterModal && (
          <div className="filter-modal-overlay">
            <div className="filter-modal">
              <h2>Filter Leave Requests</h2>
              
              <div className="filter-form">
                <div className="filter-field">
                  <label>Status</label>
                  <select 
                    value={filterOptions.status}
                    onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-field">
                  <label>Leave Type</label>
                  <select 
                    value={filterOptions.leaveType}
                    onChange={(e) => setFilterOptions({...filterOptions, leaveType: e.target.value})}
                  >
                    <option value="">All</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick</option>
                    <option value="personal">Personal</option>
                    <option value="maternity">Maternity</option>
                    <option value="paternity">Paternity</option>
                    <option value="bereavement">Bereavement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="filter-field">
                  <label>Date From</label>
                  <input 
                    type="date" 
                    value={filterOptions.dateFrom}
                    onChange={(e) => setFilterOptions({...filterOptions, dateFrom: e.target.value})}
                  />
                </div>
                
                <div className="filter-field">
                  <label>Date To</label>
                  <input 
                    type="date" 
                    value={filterOptions.dateTo}
                    onChange={(e) => setFilterOptions({...filterOptions, dateTo: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="apply-button" onClick={applyFilters}>
                  Apply Filters
                </button>
                <button className="cancel-button" onClick={() => setShowFilterModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveManagement;