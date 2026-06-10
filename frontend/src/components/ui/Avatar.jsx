import React from 'react';

const SIZES = {
  xs: 'w-5 h-5 text-[7px]',
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-11 h-11 text-lg',
};

const Avatar = ({ name, size = 'md', className = '' }) => {
  const initials = name
    ? name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className={`${SIZES[size] || SIZES.md} bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold shrink-0 ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
