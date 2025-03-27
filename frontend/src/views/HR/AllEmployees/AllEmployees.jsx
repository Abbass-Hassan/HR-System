import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllEmployees.css";
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import api from "../../../services/Api";

const AllEmployees = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count] = useState(15);
  const [openMenu, setOpenMenu] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/api/v0.1/admin/getusers/${count}/${page}`);
        const data = response.data;
        if (data.success === "true") {
          setUsers(data.users.data);
          setFilteredUsers(data.users.data);
        } else {
          setError('Failed to load users.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again.');
      }
    };

    fetchUsers();
  }, [count, page]);

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const toggleMenu = (userId) => {
    setOpenMenu((prev) => (prev === userId ? null : userId));
  };

  const deleteEmployee = async (userId) => {
    try {
      await api.delete(`/api/v0.1/admin/deleteuser/${userId}`);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete employee.');
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div>
            <div className="employee-r-header">
        <div>
          <h1 className="employee-r-title">Add Employee</h1>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>
      <div className="users-list-container">

      {error && <div className="error-message">{error}</div>}

      <div className="cards-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card">
            <div className="menu-button" onClick={() => toggleMenu(user.id)}>
              &#8942;
            </div>
            {openMenu === user.id && (
              <div className="menu-dropdown">
                <div className="menu-item" onClick={() => deleteEmployee(user.id)}>
                  Delete Employee
                </div>
              </div>
            )}
            <div className="avatar-placeholder">
              {user.first_name.charAt(0).toUpperCase()}
            </div>
            <div className="card-info">
              <h3 className="user-name">
                {user.first_name} {user.last_name}
              </h3>
              <p className="user-role">
              {user.account_type === "hr"
                ? "HR"
                : user.account_type === "manager"
                ? "Manager"
                : "Employee"}
            </p>
            </div>
          </div>
        ))}
        <div className="card add-card" onClick={() => navigate('/hr/add-employee')}>
          <div className="add-icon">+</div>
          <p>Add New Employee</p>
        </div>
      </div>

      <div className="pagination-container">
        <button onClick={goToPreviousPage} className="pagination-button">
          Back
        </button>
        <span className="page-number">Page {page}</span>
        <button onClick={goToNextPage} className="pagination-button">
          Next 
        </button>
      </div>
    </div>
    </div>
  );
};

export default AllEmployees;
