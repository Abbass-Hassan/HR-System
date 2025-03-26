import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import './SendFeedback.css';

const SendFeedback = () => {
  const [tasks, setTasks] = useState([]);
  const [feedbackInputs, setFeedbackInputs] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/v0.1/user/gettasks');
        if (response.data.success) {
          const completedTasks = response.data.data.filter(task => task.status === 'done');
          setTasks(completedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleFeedbackChange = (taskId, value) => {
    setFeedbackInputs(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleSendFeedback = async (taskId) => {
    const feedback = feedbackInputs[taskId];
    if (!feedback) {
      console.log("Please enter feedback before sending.");
      return;
    }
    try {
      const response = await api.post(`/api/v0.1/user/add_feedback/${taskId}`, { feedback });
      if (response.data.success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, feedback, feedback_provided: true } : task
          )
        );
        setFeedbackInputs(prev => ({ ...prev, [taskId]: "" }));
      } else {
        console.log("Failed to send feedback.");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      console.log("Error sending feedback.");
    }
  };

  return (
    <div className="send-feedback-container">
      <h2>Send Feedback</h2>
      {tasks.length === 0 ? (
        <p>No completed tasks found.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Due Date</th>
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
                <td>
                  {task.feedback_provided ? (
                    <div>{task.feedback}</div>
                  ) : (
                    <div className="feedback-cell">
                      <textarea
                        value={feedbackInputs[task.id] || ''}
                        onChange={(e) => handleFeedbackChange(task.id, e.target.value)}
                        placeholder="Enter feedback..."
                      />
                      <button onClick={() => handleSendFeedback(task.id)}>
                        Send Feedback
                      </button>
                    </div>
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

export default SendFeedback;
