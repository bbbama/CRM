import React from 'react';
import DataCard from './DataCard';

const PageLayout = ({ children, maxWidth = '7xl' }) => {
  const widths = {
    '5xl': 'max-w-5xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div className={`${widths[maxWidth] || widths['7xl']} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
      {children}
    </div>
  );
};

export default PageLayout;
