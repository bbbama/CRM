import React from 'react';
import DataCard from './DataCard';

const ToggleForm = ({ show, onToggle, title, children, buttonLabel, buttonShowLabel }) => (
  <>
    {show && (
      <DataCard className="mb-8" padding="p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-6">{title}</h2>
        {children}
      </DataCard>
    )}
  </>
);

export default ToggleForm;
