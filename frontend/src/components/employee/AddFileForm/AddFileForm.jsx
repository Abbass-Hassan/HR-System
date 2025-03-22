import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelector from '../CategorySelector/CategorySelector';
import FileUploader from '../FileUploader/FileUploader';
import FilePreview from '../FilePreview/FilePreview';
import './AddFileForm.css';

const AddFileForm = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
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

  const handleSubmit = () => {
    // Logic to submit the file
    console.log('Submitting file:', uploadedFile, 'with category:', selectedCategory);
    // Navigate back to documents page after submission
    navigate('/employee/documents');
  };

  return (
    <div className="add-file-form">
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

      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!uploadedFile || !selectedCategory}
      >
        Add File
      </button>
    </div>
  );
};

export default AddFileForm;