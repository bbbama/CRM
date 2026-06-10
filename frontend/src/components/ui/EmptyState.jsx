import React from 'react';

const EmptyState = ({ icon = '📭', title, action, className = '' }) => (
  <div className={`text-center py-20 card border-dashed border-2 border-gray-200 ${className}`}>
    {icon && <div className="text-4xl mb-3">{icon}</div>}
    <p className="text-gray-500 font-medium">{title}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
