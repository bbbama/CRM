import React from 'react';
import { ICONS } from './IconButton';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
};

const Button = ({ variant = 'primary', icon, children, onClick, className = '', disabled, type, ...props }) => {
  const base = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1.5">{typeof icon === 'string' ? ICONS[icon] : icon}</span>}
      {children}
    </button>
  );
};

export default Button;
