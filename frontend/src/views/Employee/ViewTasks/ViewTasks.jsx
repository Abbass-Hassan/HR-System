import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
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
        // Update the tasks state with the new status
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

  return (
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
  );
};

export default ViewTasks;
