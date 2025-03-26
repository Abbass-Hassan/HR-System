import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import './ViewFeedback.css';

const ViewFeedback = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/v0.1/user/gettasks');
        if (response.data.success) {
          const tasksWithFeedback = response.data.data.filter(task => task.feedback_provided);
          setTasks(tasksWithFeedback);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleViewFeedback = async (taskId) => {
    setLoadingFeedback(true);
    try {
      const response = await api.get(`/api/v0.1/user/viewfeedback/${taskId}`);
      if (response.data.success) {
        setSelectedTask(response.data.data);
      } else {
        alert("Failed to load feedback details.");
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
      alert("Error loading feedback details.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="view-feedback-container">
      <h2>View Feedback</h2>
      {tasks.length === 0 ? (
        <p>No feedback available yet.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <button onClick={() => handleViewFeedback(task.id)}>
                    {loadingFeedback && selectedTask && selectedTask.id === task.id ? 'Loading...' : 'View Feedback'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTask && (
        <div className="feedback-details">
          <h3>Feedback for: {selectedTask.title}</h3>
          <p><strong>Description:</strong> {selectedTask.description}</p>
          <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
          <p><strong>Feedback:</strong> {selectedTask.feedback}</p>
          <p>
            <strong>Assigned By:</strong>{" "}
            {selectedTask.assigned_by
              ? `${selectedTask.assigned_by.first_name} ${selectedTask.assigned_by.last_name}`
              : 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
