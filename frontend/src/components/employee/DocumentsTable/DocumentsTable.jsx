import React from 'react';
import './DocumentsTable.css';
import { Trash2 } from 'lucide-react';
import StatusBadge from '../../common/StatusBadge/StatusBadge';

const DocumentsTable = ({ data, onDelete }) => {
  const documentsData = data || [];

  const handleDelete = (id) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDelete(id);
    }
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
              <th>Status</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documentsData.map((document) => (
              <tr key={document.id}>
                <td className="file-name">{document.fileName}</td>
                <td>
                  <StatusBadge status={document.status.toLowerCase()} />
                </td>
                <td>{document.category}</td>
                <td>{document.date}</td>
                <td className="actions-cell">
                  {/* Only show delete button for pending documents */}
                  {document.canDelete && (
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(document.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default DocumentsTable;