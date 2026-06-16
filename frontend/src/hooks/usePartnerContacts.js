import { useState, useEffect } from 'react';
import { contactService, contactNoteService } from '../services/api';

export const usePartnerContacts = (partnerId) => {
  const [contacts, setContacts] = useState([]);
  const [contactNotes, setContactNotes] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '',
  });
  const [editingContactId, setEditingContactId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '',
  });
  const [noteInputs, setNoteInputs] = useState({});
  const [expandedNoteContact, setExpandedNoteContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await contactService.getByPartner(partnerId);
      setContacts(res.data);
      const notesMap = {};
      await Promise.all(res.data.map(async (c) => {
        try {
          const notesRes = await contactNoteService.getByContact(c.id);
          notesMap[c.id] = notesRes.data;
        } catch { notesMap[c.id] = []; }
      }));
      setContactNotes(notesMap);
    } catch (err) {
      console.error('Błąd pobierania kontaktów', err);
    }
  };

  useEffect(() => { fetchContacts(); }, [partnerId]);

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await contactService.create({ ...contactForm, employer: { id: parseInt(partnerId) } });
      setContactForm({ firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '' });
      setShowContactForm(false);
      fetchContacts();
    } catch (err) { alert('Błąd dodawania osoby.'); }
  };

  const deleteContact = async (contactId, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć ${name}?`)) {
      try {
        await contactService.delete(contactId);
        fetchContacts();
      } catch (err) { alert('Błąd usuwania. Tylko administrator może usunąć osobę kontaktową.'); }
    }
  };

  const startEditContact = (c) => {
    setEditingContactId(c.id);
    setEditForm({
      firstName: c.firstName || '', lastName: c.lastName || '',
      email: c.email || '', phoneNumber: c.phoneNumber || '', position: c.position || '',
    });
  };

  const saveContact = async (contactId) => {
    try {
      await contactService.update(contactId, editForm);
      setEditingContactId(null);
      fetchContacts();
    } catch (err) { alert('Błąd zapisu osoby kontaktowej.'); }
  };

  const addNote = async (contactId) => {
    const content = noteInputs[contactId]?.trim();
    if (!content) return;
    try {
      await contactNoteService.create(contactId, content);
      setNoteInputs({ ...noteInputs, [contactId]: '' });
      setExpandedNoteContact(null);
      const res = await contactNoteService.getByContact(contactId);
      setContactNotes({ ...contactNotes, [contactId]: res.data });
    } catch (err) { alert('Błąd dodawania notatki.'); }
  };

  const deleteNote = async (contactId, noteId) => {
    if (!window.confirm('Usunąć notatkę?')) return;
    try {
      await contactNoteService.delete(contactId, noteId);
      const res = await contactNoteService.getByContact(contactId);
      setContactNotes({ ...contactNotes, [contactId]: res.data });
    } catch (err) { alert('Błąd usuwania notatki.'); }
  };

  return {
    contacts, contactNotes,
    showContactForm, setShowContactForm,
    contactForm, setContactForm,
    editingContactId, setEditingContactId,
    editForm, setEditForm,
    noteInputs, setNoteInputs,
    expandedNoteContact, setExpandedNoteContact,
    addContact, deleteContact,
    startEditContact, saveContact,
    addNote, deleteNote, fetchContacts,
  };
};
