import React from 'react';
import './CategorySelector.css';

const CategorySelector = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="category-selector-container">
      <h2 className="selector-title">Select Category</h2>
      <div className="category-selector">
        <select 
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="" disabled>Select</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategorySelector;