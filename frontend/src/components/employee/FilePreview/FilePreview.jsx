import React from 'react';
import { File, Trash2 } from 'lucide-react';
import './FilePreview.css';

const FilePreview = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="file-preview-container">
      <div className="uploaded-file">
        <div className="file-icon">
          <File size={20} />
        </div>
        <div className="file-details">
          <div className="file-name">{file.name}</div>
          <div className="file-size">{formatFileSize(file.size)}</div>
        </div>
        <button 
          className="remove-file-btn"
          onClick={onRemove}
          title="Remove file"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;