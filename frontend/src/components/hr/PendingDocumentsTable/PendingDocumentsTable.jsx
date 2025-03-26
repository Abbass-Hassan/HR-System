import React from 'react';
import './PendingDocumentsTable.css';
import { CheckCircle, XCircle } from 'lucide-react';

const PendingDocumentsTable = ({ data, onApprove, onReject }) => {
  const documentsData = data || [];

  return (
    <div className="documents-table-container">
      {documentsData.length === 0 ? (
        <div className="empty-state">
          <p>No pending documents found</p>
        </div>
      ) : (
        <table className="documents-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentsData.map((document) => (
              <tr key={document.id}>
                <td className="file-name">{document.fileName}</td>
                <td>{document.uploadedBy}</td>
                <td>{document.category}</td>
                <td>{document.date}</td>
                <td className="actions-cell">
                  <button 
                    className="action-button approve"
                    onClick={() => onApprove(document.id)}
                    title="Approve"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    className="action-button reject"
                    onClick={() => onReject(document.id)}
                    title="Reject"
                  >
                    <XCircle size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDocumentsTable;