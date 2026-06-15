import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '../ui/IconButton';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const EditionCard = ({ edition, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  return (
    <div
      onClick={() => navigate(`/events/${eventId}/editions/${edition.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            Edycja {edition.edition}
          </span>
          {isAdmin && (
            <div className="flex gap-1 shrink-0">
              <IconButton icon="edit" onClick={(e) => { e.stopPropagation(); onEdit(edition); }} title="Edytuj" />
              <IconButton icon="delete" onClick={(e) => { e.stopPropagation(); onDelete(edition.id); }} title="Usuń" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Od</span>
            <p className="font-medium text-gray-700">{formatDate(edition.startingDate) || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Do</span>
            <p className="font-medium text-gray-700">{formatDate(edition.endingDate) || '—'}</p>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Miejsce</span>
            <p className="font-medium text-gray-700">{edition.localisation || '—'}</p>
          </div>
          {edition.description && (
            <div className="col-span-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Opis</span>
              <p className="text-gray-600">{edition.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditionCard;
