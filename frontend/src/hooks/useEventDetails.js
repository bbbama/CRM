import { useState, useEffect } from 'react';
import { eventService, editionService } from '../services/api';
import { confirmAction } from '../components/ui/ConfirmDialog';

const EMPTY_EDITION_FORM = {
  edition: '', startingDate: '', endingDate: '', localisation: '', description: '',
};

export const useEventDetails = (id) => {
  const [event, setEvent] = useState(null);
  const [editions, setEditions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_EDITION_FORM });
  const [editingId, setEditingId] = useState(null);
  const role = localStorage.getItem('role');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, editionsRes] = await Promise.all([
        eventService.getById(id),
        editionService.getByEvent(id),
      ]);
      setEvent(eventRes.data);
      setEditions(editionsRes.data);
    } catch (err) {
      console.error('Błąd pobierania danych wydarzenia', err);
    }
  };

  const addEdition = async (e) => {
    e.preventDefault();
    try {
      await editionService.create(id, form);
      setForm({ ...EMPTY_EDITION_FORM });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Tylko administrator może dodawać edycje.');
    }
  };

  const startEdit = (edition) => {
    setEditingId(edition.id);
    setForm({
      edition: edition.edition?.toString() || '',
      startingDate: edition.startingDate || '',
      endingDate: edition.endingDate || '',
      localisation: edition.localisation || '',
      description: edition.description || '',
    });
    setShowForm(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await editionService.update(id, editingId, form);
      setForm({ ...EMPTY_EDITION_FORM });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Błąd edycji edycji.');
    }
  };

  const deleteEdition = async (editionId) => {
    if (!confirmAction('Czy na pewno chcesz usunąć tę edycję?')) return;
    try {
      await editionService.delete(id, editionId);
      fetchData();
    } catch (err) {
      alert('Tylko administrator może usuwać edycje.');
    }
  };

  const handleCancel = () => {
    setForm({ ...EMPTY_EDITION_FORM });
    setShowForm(false);
    setEditingId(null);
  };

  const isAdmin = role === 'ADMIN';

  return {
    event, editions, showForm, setShowForm, form, setForm,
    editingId, isAdmin,
    addEdition, startEdit, saveEdit, deleteEdition, handleCancel, fetchData,
  };
};
