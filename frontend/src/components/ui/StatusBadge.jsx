import React from 'react';

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POTENTIAL: 'bg-amber-50 text-amber-700 border-amber-200',
  BLACKLISTED: 'bg-red-50 text-red-700 border-red-200',
  ADMIN: 'bg-red-50 text-red-600 border-red-200',
  MEMBER: 'bg-blue-50 text-blue-600 border-blue-200',
  GUEST: 'bg-gray-50 text-gray-500 border-gray-200',
};

const STATUS_LABELS = {
  ACTIVE: 'Aktywny',
  POTENTIAL: 'Potencjalny',
  BLACKLISTED: 'Czarna lista',
  ADMIN: 'Admin',
  MEMBER: 'Członek',
  GUEST: 'Gość',
};

const StatusBadge = ({ status, customStyles, customLabels }) => {
  const style = customStyles?.[status] || STATUS_STYLES[status];
  const label = customLabels?.[status] || STATUS_LABELS[status] || status;

  return (
    <span className={`badge border text-[11px] font-semibold ${style || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
