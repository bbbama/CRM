import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  if (!event) return null;

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {event.name}
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          {event.editions?.length || 0} edycji
        </p>
      </div>
    </div>
  );
};

export default EventCard;
