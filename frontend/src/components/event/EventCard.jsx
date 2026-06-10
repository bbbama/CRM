import React from 'react';

const EventCard = ({ event }) => {
  if (!event) return null;

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

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            Edycja {event.edition}
          </span>
          <span className="text-xs text-gray-400 font-medium shrink-0">
            {formatDate(event.startingDate) || event.startingDate}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
          {event.description || 'Brak dodatkowego opisu dla tego wydarzenia.'}
        </p>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Miejsce</span>
            <p className="text-sm font-medium text-gray-700">{event.localisation || 'TBD'}</p>
          </div>
          {event.endingDate && (
            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Do</span>
              <p className="text-sm font-medium text-gray-700">{formatDate(event.endingDate)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
