import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { confirmAction } from '../components/ui/ConfirmDialog';

const EMPTY_FORM = {
  name: '',
};

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const role = localStorage.getItem('role');

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

  const startEdit = (event) => {
    setEditingId(event.id);
    setForm({ name: event.name });
    setShowForm(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await eventService.update(editingId, form);
      setForm({ ...EMPTY_FORM });
      setShowForm(false);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      alert('Błąd edycji wydarzenia.');
    }
  };

  const deleteEvent = async (id) => {
    if (!confirmAction('Czy na pewno chcesz usunąć to wydarzenie?')) return;
    try {
      await eventService.delete(id);
      fetchEvents();
    } catch (err) {
      alert('Tylko administrator może usuwać wydarzenia.');
    }
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    setEditingId(null);
  };

  const isAdmin = role === 'ADMIN';

  return {
    events, showForm, setShowForm, form, setForm,
    editingId, isAdmin,
    addEvent, startEdit, saveEdit, deleteEvent, handleCancel, fetchEvents,
  };
};
