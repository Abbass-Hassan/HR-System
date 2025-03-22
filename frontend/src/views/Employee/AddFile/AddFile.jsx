import React from 'react';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import AddFileForm from '../../../components/employee/AddFileForm/AddFileForm';
import './AddFile.css';

const AddFile = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="add-file-container">
      <div className="add-file-header">
        <div>
          <h1 className="add-file-title">Document Repository</h1>
          <div className="add-file-subtitle">
            <span className="documents-link">Documents</span>
            <span className="separator"> / </span>
            <span className="add-file-link">Add File</span>
          </div>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>

      <div className="add-file-content">
        <AddFileForm />
      </div>
    </div>
  );
};

export default AddFile;