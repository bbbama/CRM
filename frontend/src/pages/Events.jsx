import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', edition: '', startingDate: '', endingDate: '', localisation: '', description: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error('Błąd pobierania wydarzeń', err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(form);
      setForm({ name: '', edition: '', startingDate: '', endingDate: '', localisation: '', description: '' });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      alert('Tylko administrator może dodawać wydarzenia.');
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Projekty i Wydarzenia</h1>
          <p className="page-subtitle">Zarządzaj eventami, na które szukamy sponsorów</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Anuluj' : 'Nowe Wydarzenie'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 animate-[fadeIn_0.2s_ease-out]">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Dodaj nowe wydarzenie</h2>
          <form onSubmit={handleAddEvent} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nazwa projektu</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="np. Inżynierskie Targi Pracy"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Edycja (Rok)</label>
                <input
                  type="number"
                  value={form.edition}
                  onChange={e => setForm({ ...form, edition: e.target.value })}
                  className="input-field"
                  placeholder="2024"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Miejsce</label>
                <input
                  value={form.localisation}
                  onChange={e => setForm({ ...form, localisation: e.target.value })}
                  className="input-field"
                  placeholder="np. Kampus AGH"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data rozpoczęcia</label>
                <input
                  type="date"
                  value={form.startingDate}
                  onChange={e => setForm({ ...form, startingDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Data zakończenia</label>
                <input
                  type="date"
                  value={form.endingDate}
                  onChange={e => setForm({ ...form, endingDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Opis</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  placeholder="Krótki cel wydarzenia..."
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button className="btn-primary">Zapisz wydarzenie</button>
            </div>
          </form>
        </div>
      )}

      {events.length === 0 && !showForm ? (
        <div className="text-center py-20 card border-dashed border-2 border-gray-200">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-500 font-medium">Brak zaplanowanych wydarzeń.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
            Dodaj pierwsze wydarzenie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <div key={event.id} className="group card-hover overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="badge bg-indigo-50 text-indigo-600 border border-indigo-100 text-[11px] font-semibold">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
