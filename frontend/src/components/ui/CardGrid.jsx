import React from 'react';

const CardGrid = ({ children, cols = 3, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${gridCols[cols] || gridCols[3]} gap-5 ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid;
