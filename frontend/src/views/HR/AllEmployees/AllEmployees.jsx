import React, { useEffect, useState } from "react";
import "./AllEmployees.css";
import SearchBar from "../../../components/common/SearchBar/SearchBar";
import api from "../../../services/Api";

const AllEmployees = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count] = useState(15);

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

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = (user.first_name + " " + user.last_name).toLowerCase();
      const accountType = user.account_type?.toLowerCase() || "";
      return (
        fullName.includes(lowercasedQuery) ||
        accountType.includes(lowercasedQuery)
      );
    });
    setFilteredUsers(filtered);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="users-list-container">
      <SearchBar onSearch={handleSearch} />

      {error && <div className="error-message">{error}</div>}

      <div className="cards-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card">
            <div className="avatar-placeholder">
              {user.first_name.charAt(0).toUpperCase()}
            </div>
            <div className="card-info">
              <h3 className="user-name">
                {user.first_name} {user.last_name}
              </h3>
              <p className="user-role">
                {user.hr_position
                  ? user.hr_position
                  : user.account_type === "hr"
                  ? "HR"
                  : "Employee"}
              </p>
            </div>
          </div>
        ))}

        <div className="card add-card">
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
  );
};

export default AllEmployees;
