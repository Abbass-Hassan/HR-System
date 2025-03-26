import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/Api.js';
import './Documents.css';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import DocumentsTable from '../../../components/employee/DocumentsTable/DocumentsTable';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents when searchTerm or selectedStatus changes
  useEffect(() => {
    let filtered = [...documents];
    
    // Filter by search term if provided
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.fileName.toLowerCase().includes(searchTermLower) ||
        doc.category.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by selected status if not 'all'
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doc => 
        doc.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedStatus, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/api/v0.1/documents');
      
      console.log('Documents response:', response.data);
      
      if (response.data.success && response.data.documents) {
        // Format the documents data for the table component
        const formattedDocs = response.data.documents.map(doc => ({
          id: doc.id,
          fileName: doc.title,
          status: doc.status.charAt(0).toUpperCase() + doc.status.slice(1), // Capitalize status
          category: doc.category || 'Uncategorized',
          date: new Date(doc.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          // Only allow delete for pending documents
          canDelete: doc.status === 'pending',
          originalData: doc // Keep the original data for reference
        }));
        
        setDocuments(formattedDocs);
        setFilteredDocuments(formattedDocs);
      } else {
        setDocuments([]);
        setFilteredDocuments([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleAddFile = () => {
    navigate('/employee/documents/add');
  };

  const handleDeleteDocument = async (id) => {
    try {
      const response = await api.delete(`/api/v0.1/documents/${id}`);
      
      if (response.data.success) {
        // Remove the document from state
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        
        // Reapply filters
        let filtered = updatedDocs;
        
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase();
          filtered = filtered.filter(doc => 
            doc.fileName.toLowerCase().includes(searchTermLower) ||
            doc.category.toLowerCase().includes(searchTermLower)
          );
        }
        
        if (selectedStatus !== 'all') {
          filtered = filtered.filter(doc => 
            doc.status.toLowerCase() === selectedStatus.toLowerCase()
          );
        }
        
        setFilteredDocuments(filtered);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. ' + 
        (err.response?.data?.message || 'Please try again.'));
    }
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
          placeholder="Search by document name or category..."
        />
        <div className="right-controls">
          {/* Integrated status filter */}
          <div className="status-filter">
            <select 
              value={selectedStatus} 
              onChange={handleStatusChange}
              className="status-select"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="add-file-button" onClick={handleAddFile}>
            Add File
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading documents...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <DocumentsTable 
          data={filteredDocuments} 
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  );
};

export default Documents;