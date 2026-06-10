import { useState, useEffect } from 'react';
import { partnerService, interactionService, eventService, contactService, contactNoteService } from '../services/api';

export const usePartnerDetails = (id) => {
  const [partner, setPartner] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    type: 'EMAIL', date: new Date().toISOString().slice(0, 16), note: '', eventId: '', isResponsive: true,
  });

  const [contactForm, setContactForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '',
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '',
  });
  const [contactNotes, setContactNotes] = useState({});
  const [noteInputs, setNoteInputs] = useState({});
  const [expandedNoteContact, setExpandedNoteContact] = useState(null);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [partnerRes, interactionsRes, eventsRes, contactsRes] = await Promise.all([
        partnerService.getById(id), interactionService.getByPartner(id),
        eventService.getAll(), contactService.getByPartner(id),
      ]);
      setPartner(partnerRes.data);
      setInteractions(interactionsRes.data);
      setEvents(eventsRes.data);
      setContacts(contactsRes.data);
      const notesMap = {};
      await Promise.all(contactsRes.data.map(async (c) => {
        try {
          const res = await contactNoteService.getByContact(c.id);
          notesMap[c.id] = res.data;
        } catch { notesMap[c.id] = []; }
      }));
      setContactNotes(notesMap);
    } catch (err) {
      console.error('Błąd pobierania danych', err);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await partnerService.update(id, { ...partner, status: newStatus });
      fetchData();
    } catch (err) { alert('Błąd aktualizacji statusu.'); }
  };

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await contactService.create({ ...contactForm, employer: { id: parseInt(id) } });
      setContactForm({ firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '' });
      setShowContactForm(false);
      fetchData();
    } catch (err) { alert('Błąd dodawania osoby.'); }
  };

  const deleteContact = async (contactId, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć ${name}?`)) {
      try {
        await contactService.delete(contactId);
        fetchData();
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
      fetchData();
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

  const addInteraction = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form, partner: { id: parseInt(id) },
        event: form.eventId ? { id: parseInt(form.eventId) } : null,
        date: form.date + ':00',
      };
      await interactionService.create(data);
      setForm({ ...form, note: '', eventId: '' });
      fetchData();
    } catch (err) { alert('Błąd zapisu kontaktu.'); }
  };

  return {
    partner,
    interactions,
    contacts,
    events,
    form, setForm,
    contactForm, setContactForm,
    showContactForm, setShowContactForm,
    editingContactId, setEditingContactId,
    editForm, setEditForm,
    contactNotes, setContactNotes,
    noteInputs, setNoteInputs,
    expandedNoteContact, setExpandedNoteContact,
    updateStatus, addContact, deleteContact,
    startEditContact, saveContact,
    addNote, deleteNote, addInteraction,
  };
};
