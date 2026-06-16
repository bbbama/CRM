import { useState, useEffect } from 'react';
import { interactionService } from '../services/api';

export const usePartnerInteractions = (partnerId) => {
  const [interactions, setInteractions] = useState([]);
  const [form, setForm] = useState({
    type: 'EMAIL', date: new Date().toISOString().slice(0, 16), note: '', eventId: '', isResponsive: true,
  });

  useEffect(() => { fetchInteractions(); }, [partnerId]);

  const fetchInteractions = async () => {
    try {
      const res = await interactionService.getByPartner(partnerId);
      setInteractions(res.data);
    } catch (err) {
      console.error('Błąd pobierania interakcji', err);
    }
  };

  const addInteraction = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form, partner: { id: parseInt(partnerId) },
        event: form.eventId ? { id: parseInt(form.eventId) } : null,
        date: form.date + ':00',
      };
      await interactionService.create(data);
      setForm({ ...form, note: '', eventId: '' });
      fetchInteractions();
    } catch (err) { alert('Błąd zapisu kontaktu.'); }
  };

  return { interactions, form, setForm, addInteraction, fetchInteractions };
};
