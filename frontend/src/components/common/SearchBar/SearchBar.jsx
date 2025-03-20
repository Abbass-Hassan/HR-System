import React from 'react';
import './SearchBar.css';

import searchSvg from '../../../assets/images/search.svg';

const SearchBar = ({ onSearch }) => {
  const handleChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="search-bar-container">
      <img src={searchSvg} alt="Search" className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, role, department..."
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;