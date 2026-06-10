import React from 'react';

const DataCard = ({ children, className = '', hover = false, gradient = '', padding = 'p-6' }) => {
  const base = 'bg-white rounded-2xl border border-gray-100 shadow-sm';
  const hoverClass = hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-200' : '';
  const gradientClass = gradient ? `bg-gradient-to-br ${gradient}` : '';

  return (
    <div className={`${base} ${hoverClass} ${gradientClass} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default DataCard;
