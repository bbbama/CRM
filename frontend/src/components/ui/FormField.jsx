import React from 'react';

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, required = false, options, className = '' }) => {
  const id = `field-${name}`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      {options ? (
        <select
          id={id}
          value={value || ''}
          onChange={e => onChange(name, e.target.value)}
          className="input-field"
          required={required}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={e => onChange(name, e.target.value)}
          className="input-field"
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
