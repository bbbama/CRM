import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from './IconButton';

const BackLink = ({ to, children = 'Powrót' }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
  >
    {ICONS.back}
    {children}
  </Link>
);

export default BackLink;
