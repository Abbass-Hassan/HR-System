import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingDocuments.css';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import RejectDocumentModal from '../../../components/hr/RejectDocumentModal/RejectDocumentModal';
import PendingDocumentsTable from '../../../components/hr/PendingDocumentsTable/PendingDocumentsTable';

const API_BASE_URL = 'http://localhost:8001';

const PendingDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  
  // For the reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  // Fetch documents on component mount
  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  // Filter documents when searchTerm or selectedUser changes
  useEffect(() => {
    filterDocuments();
  }, [searchTerm, selectedUser, documents]);

  const filterDocuments = () => {
    let filtered = [...documents];
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.fileName.toLowerCase().includes(searchTermLower) ||
        doc.uploadedBy.toLowerCase().includes(searchTermLower) ||
        doc.category.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by selected user if not 'all'
    if (selectedUser !== 'all') {
      filtered = filtered.filter(doc => 
        doc.originalData.user_id.toString() === selectedUser
      );
    }
    
    setFilteredDocuments(filtered);
  };

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/v0.1/admin/documents?status=pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Pending documents response:', response.data);
      
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
          originalData: doc // Keep original data
        }));
        
        setDocuments(formattedDocs);
        setFilteredDocuments(formattedDocs);
        
        // Extract unique users for the filter
        const uniqueUsers = [];
        const userMap = new Map();
        
        response.data.documents.forEach(doc => {
          if (doc.user && !userMap.has(doc.user.id)) {
            userMap.set(doc.user.id, true);
            uniqueUsers.push({
              id: doc.user.id,
              name: `${doc.user.first_name} ${doc.user.last_name}`
            });
          }
        });
        
        setUsers(uniqueUsers);
      } else {
        setDocuments([]);
        setFilteredDocuments([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending documents:', err);
      setError('Failed to load documents. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleFilter = () => {
    // You might implement additional filtering logic here
    console.log('Filter button clicked');
  };

  const handleApproveDocument = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v0.1/admin/documents/${id}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Remove the document from the pending list
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        
        // Reapply filters
        filterDocuments();
        
        alert('Document approved successfully');
      }
    } catch (err) {
      console.error('Error approving document:', err);
      alert('Failed to approve document. Please try again.');
    }
  };

  const handleRejectClick = (id) => {
    setSelectedDocumentId(id);
    setShowRejectModal(true);
  };

  const handleRejectDocument = async (id, feedback) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v0.1/admin/documents/${id}/reject`,
        { feedback },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Remove the document from the pending list
        const updatedDocs = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocs);
        
        // Reapply filters
        filterDocuments();
        
        setShowRejectModal(false);
        alert('Document rejected successfully');
      }
    } catch (err) {
      console.error('Error rejecting document:', err);
      alert('Failed to reject document. Please try again.');
    }
  };
  
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setSelectedDocumentId(null);
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
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by name, category, or employee..."
        />
        <div className="right-controls">
          {/* User filter dropdown */}
          <div className="user-filter">
            <select 
              value={selectedUser} 
              onChange={handleUserChange}
              className="user-select"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading documents...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <PendingDocumentsTable 
          data={filteredDocuments} 
          onApprove={handleApproveDocument}
          onReject={handleRejectClick}
        />
      )}

      {showRejectModal && (
        <RejectDocumentModal
          isOpen={showRejectModal}
          onClose={handleCloseRejectModal}
          onReject={(feedback) => handleRejectDocument(selectedDocumentId, feedback)}
        />
      )}
    </div>
  );
};

export default PendingDocuments;