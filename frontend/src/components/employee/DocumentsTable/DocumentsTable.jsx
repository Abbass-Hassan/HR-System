import React from 'react';
import './DocumentsTable.css';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../../common/StatusBadge/StatusBadge';

const DocumentsTable = ({ data }) => {
  const documentsData = data || [];

  const handleEdit = (id) => {
    console.log('Edit document with ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete document with ID:', id);
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
                  <StatusBadge status={document.status} />
                </td>
                <td>{document.category}</td>
                <td>{document.date}</td>
                <td className="actions-cell">
                  <button 
                    className="action-button edit"
                    onClick={() => handleEdit(document.id)}
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={() => handleDelete(document.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
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