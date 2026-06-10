import React from 'react';

const InteractionForm = ({ form, onFormChange, events = [], onSubmit }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6 text-white">
    <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-5">Zarejestruj kontakt</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Typ kontaktu</label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
          value={form.type}
          onChange={e => onFormChange({ ...form, type: e.target.value })}
        >
          <option value="EMAIL">Email</option>
          <option value="PHONE">Telefon</option>
          <option value="MEETING">Spotkanie</option>
          <option value="LINKEDIN">LinkedIn</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">Notatka</label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
          rows="3"
          placeholder="O czym rozmawialiście?"
          value={form.note}
          onChange={e => onFormChange({ ...form, note: e.target.value })}
          required
        />
      </div>

      {events.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Powiązane wydarzenie (opcjonalne)</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
            value={form.eventId}
            onChange={e => onFormChange({ ...form, eventId: e.target.value })}
          >
            <option value="">Brak</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name} ({ev.edition})</option>
            ))}
          </select>
        </div>
      )}

      <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-900/30">
        Zapisz w historii
      </button>
    </form>
  </div>
);

export default InteractionForm;
