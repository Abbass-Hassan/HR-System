import React from 'react';
import './ApprovedDocumentsTable.css';
import { Eye, Trash2 } from 'lucide-react';

const ApprovedDocumentsTable = ({ data, onView, onDelete }) => {
  const documentsData = data || [];

  const handleView = (filePath) => {
    if (onView) {
      onView(filePath);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  return (
    <div className="approved-documents-table-container">
      {documentsData.length === 0 ? (
        <div className="empty-state">
          <p>No approved documents found</p>
        </div>
      ) : (
        <table className="approved-documents-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Category</th>
              <th>Date Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentsData.map((document) => (
              <tr key={document.id}>
                <td className="file-name">{document.fileName}</td>
                <td>{document.uploadedBy}</td>
                <td>{document.category}</td>
                <td>{document.approvalDate || document.date}</td>
                <td className="actions-cell">
                  <button 
                    className="action-button view"
                    onClick={() => handleView(document.filePath)}
                    title="View"
                  >
                    <Eye size={20} />
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={() => handleDelete(document.id)}
                    title="Delete"
                  >
                    <Trash2 size={20} />
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

export default ApprovedDocumentsTable;