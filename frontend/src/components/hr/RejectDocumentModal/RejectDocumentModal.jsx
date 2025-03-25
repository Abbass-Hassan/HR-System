import React, { useState } from 'react';
import './RejectDocumentModal.css';

const RejectDocumentModal = ({ isOpen, onClose, onReject }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      setError('Please provide feedback for the rejection');
      return;
    }
    
    onReject(feedback);
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="reject-modal">
        <div className="modal-header">
          <h3>Reject Document</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Please provide feedback explaining why this document is being rejected.</p>
          
          <div className="form-group">
            <label htmlFor="feedback">Feedback</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              placeholder="Enter rejection reason..."
              className="feedback-input"
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button 
            className="reject-button"
            onClick={handleSubmit}
            disabled={!feedback.trim()}
          >
            Reject Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDocumentModal;