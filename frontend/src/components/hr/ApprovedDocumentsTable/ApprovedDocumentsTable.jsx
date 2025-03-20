import React from 'react';
import './ApprovedDocumentsTable.css';
import { Edit, Trash2 } from 'lucide-react';

const ApprovedDocumentsTable = ({ data }) => {
  const documentsData = data || [];

  const handleEdit = (id) => {
    console.log('Edit document with ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete document with ID:', id);
  };

  return (
    <div className="approved-documents-table-container">
      {documentsData.length === 0 ? (
        <div className="empty-state">
          <p>No documents found</p>
        </div>
      ) : (
        <table className="approved-documents-table">
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
                    className="action-button edit"
                    onClick={() => handleEdit(document.id)}
                    title="Edit"
                  >
                    <Edit size={20} />
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