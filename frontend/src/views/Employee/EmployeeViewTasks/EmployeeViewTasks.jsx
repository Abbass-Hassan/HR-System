import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import './ViewTasks.css';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/v0.1/user/gettasks');
        if (response.data.success) {
          setTasks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    console.log(`Changing task ${taskId} to status: ${newStatus}`);
    try {
      const response = await api.post(`/api/v0.1/user/updatestatus/${taskId}`, { status: newStatus });
      if (!response.data.success) {
        alert("Failed to update task status.");
      } else {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status.");
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
      <div className="view-tasks-container">
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Assigned By</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  {task.assigned_by
                    ? `${task.assigned_by.first_name} ${task.assigned_by.last_name}`
                    : 'N/A'}
                </td>
                <td>{task.due_date}</td>
                <td className="status-cell">
                  {task.status === "done" ? (
                    <span className="status-badge">DONE</span>
                  ) : (
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default ViewTasks;
