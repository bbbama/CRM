import React from 'react';
import { Avatar } from '../ui';

const INTERACTION_ICONS = {
  EMAIL: '✉️',
  PHONE: '📞',
  MEETING: '🤝',
  LINKEDIN: '💼',
};

const InteractionItem = ({ item }) => (
  <div className="relative">
    <div className="absolute -left-[41px] top-0.5 w-5 h-5 bg-white border-4 border-indigo-500 rounded-full" />
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm">{INTERACTION_ICONS[item.type] || '📋'}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {item.type}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.date).toLocaleString('pl-PL', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        {item.event && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50/50 text-indigo-500 border border-indigo-100 shrink-0">
            {item.event.name}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{item.note}</p>

      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
        <Avatar name={`${item.member?.firstName || ''} ${item.member?.lastName || ''}`} size="xs" />
        <span className="text-xs text-gray-400">
          Notatka od: <span className="font-medium text-gray-500">{item.member?.firstName} {item.member?.lastName}</span>
        </span>
      </div>
    </div>
  </div>
);

const InteractionTimeline = ({ interactions = [] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
      <span className="w-1 h-5 bg-indigo-600 rounded-full" />
      Historia aktywności
    </h2>

    <div className="relative pl-8 border-l-2 border-gray-100 space-y-6">
      {interactions.map(item => (
        <InteractionItem key={item.id} item={item} />
      ))}
      {interactions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-3">📭</div>
          <p className="font-medium">Brak zarejestrowanych kontaktów.</p>
          <p className="text-sm mt-1">Dodaj pierwszy kontakt w panelu po prawej.</p>
        </div>
      )}
    </div>
  </div>
);

export default InteractionTimeline;
