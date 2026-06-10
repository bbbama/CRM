import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, IconButton } from '../ui';

const PartnerCard = ({ partner, onDelete }) => {
  if (!partner) return null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 p-5 relative">
      <Link to={`/partners/${partner.id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600 group-hover:scale-110 transition-transform duration-200">
            {partner.name?.charAt(0) || '?'}
          </div>
          <StatusBadge status={partner.status} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
          {partner.name}
        </h3>
        <p className="text-sm text-gray-500 mb-5">{partner.industry}</p>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Kliknij, aby zobaczyć szczegóły</span>
          <span className="text-indigo-500 group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </Link>
      <IconButton
        icon="delete"
        onClick={(e) => { e.preventDefault(); onDelete(partner.id, partner.name); }}
        className="absolute top-3 right-3 bg-white/80 opacity-0 group-hover:opacity-100"
        title="Usuń firmę"
      />
    </div>
  );
};

export default PartnerCard;
