import { useState, useEffect } from 'react';
import { partnerService, eventService } from '../services/api';
import { usePartnerContacts } from './usePartnerContacts';
import { usePartnerInteractions } from './usePartnerInteractions';

export const usePartnerDetails = (id) => {
  const [partner, setPartner] = useState(null);
  const [events, setEvents] = useState([]);

  const contactsData = usePartnerContacts(id);
  const interactionsData = usePartnerInteractions(id);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const [partnerRes, eventsRes] = await Promise.all([
          partnerService.getById(id),
          eventService.getAll(),
        ]);
        setPartner(partnerRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Błąd pobierania danych', err);
      }
    };
    fetchPartner();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await partnerService.update(id, { ...partner, status: newStatus });
      const res = await partnerService.getById(id);
      setPartner(res.data);
    } catch (err) { alert('Błąd aktualizacji statusu.'); }
  };

  return {
    partner,
    events,
    interactions: interactionsData.interactions,
    form: interactionsData.form,
    setForm: interactionsData.setForm,
    addInteraction: interactionsData.addInteraction,
    contacts: contactsData.contacts,
    contactNotes: contactsData.contactNotes,
    showContactForm: contactsData.showContactForm,
    setShowContactForm: contactsData.setShowContactForm,
    contactForm: contactsData.contactForm,
    setContactForm: contactsData.setContactForm,
    editingContactId: contactsData.editingContactId,
    setEditingContactId: contactsData.setEditingContactId,
    editForm: contactsData.editForm,
    setEditForm: contactsData.setEditForm,
    noteInputs: contactsData.noteInputs,
    setNoteInputs: contactsData.setNoteInputs,
    expandedNoteContact: contactsData.expandedNoteContact,
    setExpandedNoteContact: contactsData.setExpandedNoteContact,
    updateStatus,
    addContact: contactsData.addContact,
    deleteContact: contactsData.deleteContact,
    startEditContact: contactsData.startEditContact,
    saveContact: contactsData.saveContact,
    addNote: contactsData.addNote,
    deleteNote: contactsData.deleteNote,
  };
};
