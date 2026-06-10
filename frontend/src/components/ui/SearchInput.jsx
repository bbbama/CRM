import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Szukaj...', className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder={placeholder}
      className="input-field pl-10"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default SearchInput;
