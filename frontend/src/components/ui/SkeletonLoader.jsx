import React from 'react';

const SkeletonLoader = ({ lines = 2, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`h-4 bg-gray-100 rounded-lg mx-auto ${i === lines - 1 ? 'w-48' : 'w-64'}`} />
    ))}
  </div>
);

export default SkeletonLoader;
