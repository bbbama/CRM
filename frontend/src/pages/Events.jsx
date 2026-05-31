import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    edition: '',
    startingDate: '',
    endingDate: '',
    localisation: '',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error("Błąd pobierania wydarzeń", err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(form);
      setForm({ name: '', edition: '', startingDate: '', endingDate: '', localisation: '', description: '' });
      fetchEvents();
    } catch (err) {
      alert("Błąd podczas dodawania wydarzenia. Pamiętaj, że tylko Admin może dodawać wydarzenia.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Wydarzeniami</h2>
      
      {/* Formularz dodawania */}
      <form onSubmit={handleAddEvent} className="bg-white p-6 rounded-lg shadow-sm mb-8 border">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Nowe Wydarzenie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
            <input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="np. Inżynierskie Targi Pracy"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edycja</label>
            <input 
              type="number"
              value={form.edition} 
              onChange={e => setForm({...form, edition: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="np. 2024"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja</label>
            <input 
              value={form.localisation} 
              onChange={e => setForm({...form, localisation: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="np. Hala Wisły"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data rozpoczęcia</label>
            <input 
              type="date"
              value={form.startingDate} 
              onChange={e => setForm({...form, startingDate: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data zakończenia</label>
            <input 
              type="date"
              value={form.endingDate} 
              onChange={e => setForm({...form, endingDate: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              rows="2"
              placeholder="Krótki opis wydarzenia..."
            />
          </div>
        </div>
        <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-semibold">
          Dodaj Wydarzenie
        </button>
      </form>

      {/* Lista Wydarzeń */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold uppercase">
                {event.edition}. edycja
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{event.description || "Brak opisu."}</p>
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold">📍 Miejsce:</span> {event.localisation || "Nieokreślone"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">📅 Termin:</span> {event.startingDate} {event.endingDate ? `— ${event.endingDate}` : ''}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 italic bg-white rounded-lg border">
            Brak zaplanowanych wydarzeń.
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
