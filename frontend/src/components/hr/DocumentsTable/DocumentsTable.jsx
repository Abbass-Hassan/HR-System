import React from 'react';
import './DocumentsTable.css';
import { CheckCircle, XCircle } from 'lucide-react';

const DocumentsTable = ({ data }) => {
  const documentsData = data || [];

  const handleApprove = (id) => {
    console.log('Approved document with ID:', id);
  };

  const handleReject = (id) => {
    console.log('Rejected document with ID:', id);
  };

  return (
    <div className="documents-table-container">
      {documentsData.length === 0 ? (
        <div className="empty-state">
          <p>No documents found</p>
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
                    onClick={() => handleApprove(document.id)}
                    title="Approve"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    className="action-button reject"
                    onClick={() => handleReject(document.id)}
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

export default DocumentsTable;