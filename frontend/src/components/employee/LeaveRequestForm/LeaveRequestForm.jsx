import React, { useState, useEffect } from 'react';
import './LeaveRequestForm.css';
import api from '../../../services/Api';
import { useToast } from '../../../context/Toast/Toast';

const leaveTypes = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'other', label: 'Other' }
];

const LeaveRequestForm = ({ onSubmit, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

// LeaveRequestForm.jsx continued
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const minDate = tomorrowDate.toISOString().split('T')[0];

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.leave_type || !formData.start_date || !formData.end_date || !formData.reason) {
    showToast('Error', 'Please fill all required fields');
    return;
  }
  
  setLoading(true);
  
  try {
    const response = await api.post('/api/v0.1/leave', formData);
    
    if (response.data.success) {
      showToast('Success', 'Leave request submitted successfully');
      
      // Reset form
      setFormData({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
      });
      
      // Notify parent component
      if (onSuccess) {
        onSuccess(response.data.leave_request);
      }
    }
  } catch (err) {
    showToast('Error', err.response?.data?.message || 'Failed to submit leave request');
  } finally {
    setLoading(false);
  }
};

const handleCancel = () => {
  setFormData({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
};

return (
  <div className="leave-request-form-wrapper">
    <h2 className="form-title">Request Time Off</h2>
    
    <form className="leave-request-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-field">
          <label>Leave Type</label>
          <select 
            name="leave_type" 
            value={formData.leave_type}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">Select Type</option>
            {leaveTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-field">
          <label>Date From</label>
          <input 
            type="date" 
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="form-input"
            min={minDate}
            disabled={loading}
          />
        </div>
        
        <div className="form-field">
          <label>Date To</label>
          <input 
            type="date" 
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="form-input"
            min={formData.start_date || minDate}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="form-field full-width">
        <label>Reason</label>
        <textarea 
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Please provide a reason for your leave request"
          rows={3}
          disabled={loading}
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button 
          type="button" 
          className="cancel-button" 
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);
};

export default LeaveRequestForm;