import React from 'react';
import './FilterButton.css';
import filterSvg from '../../../assets/images/filter.svg'; 

const FilterButton = ({ onClick }) => {
  return (
    <button className="filter-button" onClick={onClick}>
      <span>Filter</span>
      <img src={filterSvg} alt="Filter" className="filter-icon" />
    </button>
  );
};

export default FilterButton;