import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Documents.css';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import DocumentsTable from '../../../components/employee/DocumentsTable/DocumentsTable';

const API_BASE_URL = 'http://localhost:8001';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = documents.filter(doc => 
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
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
          // Add additional fields for delete functionality
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

  const handleFilter = () => {
    console.log('Filter button clicked');
    // Implement filtering logic based on your requirements
  };

  const handleAddFile = () => {
    navigate('/employee/documents/add');
  };

  const handleDeleteDocument = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_BASE_URL}/api/v0.1/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove the document from state
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        setFilteredDocuments(updatedDocs.filter(doc => 
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchTerm.toLowerCase())
        ));
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
          <FilterButton onClick={handleFilter} />
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