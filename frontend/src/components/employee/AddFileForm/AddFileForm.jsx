import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategorySelector from '../CategorySelector/CategorySelector';
import FileUploader from '../FileUploader/FileUploader';
import FilePreview from '../FilePreview/FilePreview';
import './AddFileForm.css';

const AddFileForm = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const categories = [
    'ID',
    'Certificate',
    'Contract',
    'Resume',
    'Other'
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!uploadedFile) {
      setError('Please upload a file');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', `${selectedCategory}: ${title}`);
      formData.append('description', description);
      formData.append('file', uploadedFile);
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Make API request to upload document
      const response = await axios.post(
        'http://localhost:8001/api/v0.1/documents', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Upload response:', response.data);
      
      // Navigate back to documents page after successful submission
      navigate('/employee/documents');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-file-form">
      <div className="form-group">
        <label htmlFor="title">Document Title</label>
        <input
          type="text"
          id="title"
          className="form-control"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          className="form-control"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      
      <CategorySelector 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />
      
      {!uploadedFile ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : (
        <FilePreview file={uploadedFile} onRemove={handleRemoveFile} />
      )}
      
      {error && <div className="error-message">{error}</div>}

      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading || !uploadedFile || !selectedCategory || !title.trim()}
      >
        {loading ? 'Uploading...' : 'Add File'}
      </button>
    </div>
  );
};

export default AddFileForm;