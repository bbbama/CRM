import { useState } from 'react';
import { contactNoteService } from '../services/api';

export const useContactNotes = () => {
  const [contactNotes, setContactNotes] = useState({});
  const [noteInputs, setNoteInputs] = useState({});
  const [expandedNoteContact, setExpandedNoteContact] = useState(null);

  const fetchNotesForContact = async (contactId) => {
    try {
      const res = await contactNoteService.getByContact(contactId);
      setContactNotes(prev => ({ ...prev, [contactId]: res.data }));
    } catch {
      setContactNotes(prev => ({ ...prev, [contactId]: [] }));
    }
  };

  const addNote = async (contactId) => {
    const content = noteInputs[contactId]?.trim();
    if (!content) return;
    try {
      await contactNoteService.create(contactId, content);
      setNoteInputs(prev => ({ ...prev, [contactId]: '' }));
      setExpandedNoteContact(null);
      fetchNotesForContact(contactId);
    } catch (err) { alert('Błąd dodawania notatki.'); }
  };

  const deleteNote = async (contactId, noteId) => {
    if (!window.confirm('Usunąć notatkę?')) return;
    try {
      await contactNoteService.delete(contactId, noteId);
      fetchNotesForContact(contactId);
    } catch (err) { alert('Błąd usuwania notatki.'); }
  };

  return {
    contactNotes, setContactNotes,
    noteInputs, setNoteInputs,
    expandedNoteContact, setExpandedNoteContact,
    addNote, deleteNote, fetchNotesForContact,
  };
};
