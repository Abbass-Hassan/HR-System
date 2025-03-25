import React, { useState } from 'react';
import Layout from '../../../components/hr/Layout/Layout';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import EmployeeLeaveCard from '../../../components/hr/EmployeeLeaveCard/EmployeeLeaveCard';
import StatsCard from '../../../components/hr/StatsCard/StatsCard';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Supply Officer',
      avatar: '/avatars/john-doe.jpg',
      leaveRequests: [
        {
          id: 1,
          leaveType: 'Time Off',
          duration: '72 hours',
          dateFrom: '21/2/2025',
          dateTo: '24/2/2025',
          status: 'pending'
        },
        {
          id: 2,
          leaveType: 'Sick',
          duration: '48 hours',
          dateFrom: '7/9/2024',
          dateTo: '9/9/2024',
          status: 'approved'
        }
      ]
    },
    {
      id: 2,
      name: 'Adam Smith',
      role: 'Technical Analyst',
      avatar: '/avatars/adam-smith.jpg',
      leaveRequests: [
        {
          id: 3,
          leaveType: 'Time Off',
          duration: '72 hours',
          dateFrom: '21/2/2025',
          dateTo: '24/2/2025',
          status: 'pending'
        }
      ]
    },
    {
      id: 3,
      name: 'Jane Austin',
      role: 'Lead Developer',
      avatar: '/avatars/jane-austin.jpg',
      leaveRequests: [
        {
          id: 4,
          leaveType: 'Time Off',
          duration: '72 hours',
          dateFrom: '21/2/2025',
          dateTo: '24/2/2025',
          status: 'pending'
        }
      ]
    },
    {
      id: 4,
      name: 'Samantha Smith',
      role: 'IT Specialist',
      avatar: '/avatars/samantha-smith.jpg',
      leaveRequests: [
        {
          id: 5,
          leaveType: 'Time Off',
          duration: '72 hours',
          dateFrom: '21/2/2025',
          dateTo: '24/2/2025',
          status: 'pending'
        }
      ]
    },
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Filter button clicked');
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
      count: 3,
      title: 'Days Available',
      subtitle: 'To Issue Time Off',
      color: 'teal'
    },
    {
      id: 2,
      count: 1,
      title: 'Pending Request',
      subtitle: 'Awaiting Manager Approval',
      color: 'blue'
    },
    {
      id: 3,
      count: 0,
      title: 'Days Upcoming',
      subtitle: '0 Days Taken',
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
              <button className="view-all-button">View All</button>
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

          <div className="employee-cards">
            {filteredEmployees.map((employee) => (
              <EmployeeLeaveCard 
                key={employee.id} 
                employee={employee} 
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveManagement;