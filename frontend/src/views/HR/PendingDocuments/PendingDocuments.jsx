import React from 'react';
import './PendingDocuments.css';
import SearchBar from '../../../components/hr/SearchBar/SearchBar';
import FilterButton from '../../../components/hr/FilterButton/FilterButton';
import DateDisplay from '../../../components/hr/DateDisplay/DateDisplay';
import DocumentsTable from '../../../components/hr/DocumentsTable/DocumentsTable';

const PendingDocuments = () => {
  const documentsData = [
    {
      id: 1,
      fileName: 'Abbas-Hassan-id',
      uploadedBy: 'Abbas Hassan',
      category: 'id',
      date: '15 March, 2025'
    },
    {
      id: 2,
      fileName: 'Abbas-Hassan-Contract',
      uploadedBy: 'Abbas Hassan',
      category: 'Contract',
      date: '15 March, 2025'
    },
    {
      id: 3,
      fileName: 'Abbas-Hassan-Certificate',
      uploadedBy: 'Abbas Hassan',
      category: 'Certificate',
      date: '15 March, 2025'
    },
    {
      id: 4,
      fileName: 'Mahmoud-Sayed-id',
      uploadedBy: 'Rawan Ghobar',
      category: 'id',
      date: '15 March, 2025'
    },
    {
      id: 5,
      fileName: 'Mahmoud-Sayed-Contract',
      uploadedBy: 'Rawan Ghobar',
      category: 'Contract',
      date: '15 March, 2025'
    },
    {
      id: 6,
      fileName: 'Mahmoud-Sayed-Certificate',
      uploadedBy: 'Rawan Ghobar',
      category: 'Certificate',
      date: '15 March, 2025'
    },
    {
      id: 7,
      fileName: 'Marwa-Tarshishi-id',
      uploadedBy: 'Abbas Hassan',
      category: 'id',
      date: '15 March, 2025'
    },
    {
      id: 8,
      fileName: 'Marwa-Tarshishi-Contract',
      uploadedBy: 'Abbas Hassan',
      category: 'Contract',
      date: '15 March, 2025'
    },
    {
      id: 9,
      fileName: 'Marwa-Tarshishi-Certificate',
      uploadedBy: 'Abbas Hassan',
      category: 'Certificate',
      date: '15 March, 2025'
    },
    {
      id: 10,
      fileName: 'Ali-Ahmad-id',
      uploadedBy: 'Abbas Hassan',
      category: 'id',
      date: '15 March, 2025'
    },
    {
      id: 11,
      fileName: 'Ali-Ahmad-Contract',
      uploadedBy: 'Abbas Hassan',
      category: 'Contract',
      date: '15 March, 2025'
    }
  ];

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleFilter = () => {
    console.log('Filter button clicked');
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="pending-documents-container">
      <div className="pending-documents-header">
        <div>
          <h1 className="pending-documents-title">Document Repository</h1>
          <div className="pending-documents-subtitle">
            <span className="documents-link">Documents</span>
            <span className="separator"> / </span>
            <span className="pending-link">Pending</span>
          </div>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>

      <div className="table-controls-container">
        <SearchBar onSearch={handleSearch} />
        <div className="right-controls">
          <FilterButton onClick={handleFilter} />
        </div>
      </div>

      <DocumentsTable data={documentsData} />
    </div>
  );
};

export default PendingDocuments;