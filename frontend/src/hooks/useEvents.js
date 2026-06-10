import { useState, useEffect } from 'react';
import { eventService } from '../services/api';

const EMPTY_FORM = {
  name: '', edition: '', startingDate: '', endingDate: '', localisation: '', description: '',
};

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error('Błąd pobierania wydarzeń', err);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(form);
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      alert('Tylko administrator może dodawać wydarzenia.');
    }
  };

  return { events, showForm, setShowForm, form, setForm, addEvent, fetchEvents };
};
