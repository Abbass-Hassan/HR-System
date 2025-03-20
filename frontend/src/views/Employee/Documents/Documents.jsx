import React from 'react';
import './Documents.css';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import DocumentsTable from '../../../components/employee/DocumentsTable/DocumentsTable';

const Documents = () => {
  const documentsData = [
    {
      id: 1,
      fileName: 'Abbas-Hassan-id',
      status: 'Approved',
      category: 'id',
      date: '15 March, 2025'
    },
    {
      id: 2,
      fileName: 'Abbas-Hassan-Contract',
      status: 'Approved',
      category: 'Contract',
      date: '15 March, 2025'
    },
    {
      id: 3,
      fileName: 'Abbas-Hassan-Certificate',
      status: 'Denied',
      category: 'Certificate',
      date: '15 March, 2025'
    }
  ];

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleFilter = () => {
    console.log('Filter button clicked');
  };

  const handleAddFile = () => {
    console.log('Add file button clicked');
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div>
          <h1 className="documents-title">Document Repository</h1>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>

      <div className="table-controls-container">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by name, role, department..."
        />
        <div className="right-controls">
          <FilterButton onClick={handleFilter} />
          <button className="add-file-button" onClick={handleAddFile}>
            Add File
          </button>
        </div>
      </div>

      <DocumentsTable data={documentsData} />
    </div>
  );
};

export default Documents;