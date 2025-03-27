import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import './ManagerViewTasks.css';

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
      <h2>Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  {task.assigned_to
                    ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}`
                    : 'N/A'}
                </td>
                <td>{task.due_date}</td>
                <td>{task.status.replace('_', ' ')}</td>
                <td>{task.feedback_provided ? task.feedback : 'N/A'}</td>
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
