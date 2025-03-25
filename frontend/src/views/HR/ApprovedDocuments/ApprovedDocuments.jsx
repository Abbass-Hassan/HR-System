import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApprovedDocuments.css';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterButton from '../../../components/common/FilterButton/FilterButton';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import ApprovedDocumentsTable from '../../../components/hr/ApprovedDocumentsTable/ApprovedDocumentsTable';

const API_BASE_URL = 'http://localhost:8001';

const ApprovedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch documents on component mount
  useEffect(() => {
    fetchApprovedDocuments();
  }, []);

  // Filter documents when searchTerm changes
  useEffect(() => {
    filterDocuments();
  }, [searchTerm, documents]);

  const filterDocuments = () => {
    if (!searchTerm.trim()) {
      setFilteredDocuments(documents);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = documents.filter(doc => 
      doc.fileName.toLowerCase().includes(searchTermLower) ||
      doc.uploadedBy.toLowerCase().includes(searchTermLower) ||
      doc.category.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredDocuments(filtered);
  };

  const fetchApprovedDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/admin/documents?status=approved`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Approved documents response:', response.data);
      
      if (response.data.success && response.data.documents) {
        // Format data for the table
        const formattedDocs = response.data.documents.map(doc => ({
          id: doc.id,
          fileName: doc.title,
          uploadedBy: doc.user ? `${doc.user.first_name} ${doc.user.last_name}` : 'Unknown User',
          category: doc.category || 'Uncategorized',
          date: new Date(doc.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          // Additional information
          approvedBy: doc.reviewer ? `${doc.reviewer.first_name} ${doc.reviewer.last_name}` : 'Unknown',
          approvalDate: doc.reviewed_at ? new Date(doc.reviewed_at).toLocaleDateString('en-GB') : 'Unknown',
          filePath: doc.file_path,
          originalData: doc // Keep original data
        }));
        
        setDocuments(formattedDocs);
        setFilteredDocuments(formattedDocs);
      } else {
        setDocuments([]);
        setFilteredDocuments([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approved documents:', err);
      setError('Failed to load documents. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = () => {
    // Implement filtering logic based on your requirements
    console.log('Filter button clicked');
  };

  const handleViewDocument = (filePath) => {
    // Construct the full URL to the document
    const fileUrl = `${API_BASE_URL}/storage/${filePath}`;
    
    // Open the document in a new tab
    window.open(fileUrl, '_blank');
  };

  const handleDeleteDocument = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_BASE_URL}/api/v0.1/admin/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove the document from state
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        setFilteredDocuments(updatedDocs.filter(doc => 
          !searchTerm || 
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        
        // Show success message
        alert('Document deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document. ' + (err.response?.data?.message || 'Please try again.'));
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="approved-documents-container">
      <div className="approved-documents-header">
        <div>
          <h1 className="approved-documents-title">Document Repository</h1>
          <div className="approved-documents-subtitle">
            <span className="documents-link">Documents</span>
            <span className="separator"> / </span>
            <span className="approved-link">Approved</span>
          </div>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>

      <div className="table-controls-container">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search by name, category, or employee..."
        />
        <div className="right-controls">
          <FilterButton onClick={handleFilter} />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading documents...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ApprovedDocumentsTable 
          data={filteredDocuments}
          onView={handleViewDocument}
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  );
};

export default ApprovedDocuments;