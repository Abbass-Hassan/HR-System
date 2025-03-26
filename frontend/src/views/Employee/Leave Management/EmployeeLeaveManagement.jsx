import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import { useToast } from '../../../context/Toast/Toast';
import Layout from '../../../components/employee/Layout/Layout';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import LeaveStatisticsCards from '../../../components/employee/Training/LeaveStatisticsCards/LeaveStatisticsCards';
import LeaveRequestForm from '../../../components/employee/LeaveRequestForm/LeaveRequestForm';
import LeaveHistoryTable from '../../../components/employee/LeaveHistoryTable/LeaveHistoryTable';
import './EmployeeLeaveManagement.css';

const EmployeeLeaveManagement = () => {
  const { showToast } = useToast();
  const [statistics, setStatistics] = useState({
    days_available: 0,
    pending_requests: 0,
    upcoming_days: 0
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v0.1/leave/statistics');
      
      if (response.data.success) {
        setStatistics(response.data.statistics);
        setLeaveHistory(response.data.leave_history);
        setError(null);
      } else {
        setError('Failed to load leave data');
      }
    } catch (err) {
      console.error('Error fetching leave data:', err);
      setError('Failed to load leave data. Please try again.');
      showToast('Error', 'Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRequestSuccess = () => {
    // Refresh data after successful request
    fetchLeaveData();
  };

  return (
    <Layout>
      <div className="leave-management-container">
        <PageHeader 
          title="Leave Management" 
          subTitle="Employee" 
          subSubTitle="Leave requests" 
        />
        
        <LeaveStatisticsCards 
          statistics={statistics} 
          loading={loading} 
        />
        
        <div className="leave-request-section">
          <LeaveRequestForm onSuccess={handleLeaveRequestSuccess} />
        </div>
        
        <div className="leave-history-section">
          <h2 className="section-heading">Time Off History</h2>
          <LeaveHistoryTable 
            leaveHistory={leaveHistory} 
            loading={loading} 
          />
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={fetchLeaveData} className="retry-button">
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeLeaveManagement;