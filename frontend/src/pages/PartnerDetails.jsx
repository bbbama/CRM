import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { partnerService, interactionService, eventService, contactService, contactNoteService } from '../services/api';

const STATUS_LABELS = {
  POTENTIAL: 'Potencjalny',
  ACTIVE: 'Aktywny Partner',
  BLACKLISTED: 'Czarna lista',
};

const INTERACTION_ICONS = {
  EMAIL: '✉️',
  PHONE: '📞',
  MEETING: '🤝',
  LINKEDIN: '💼',
};

const PartnerDetails = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    type: 'EMAIL',
    date: new Date().toISOString().slice(0, 16),
    note: '',
    eventId: '',
    isResponsive: true,
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [partnerRes, interactionsRes, eventsRes, contactsRes] = await Promise.all([
        partnerService.getById(id),
        interactionService.getByPartner(id),
        eventService.getAll(),
        contactService.getByPartner(id),
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
        } catch {
          notesMap[c.id] = [];
        }
      }));
      setContactNotes(notesMap);
    } catch (err) {
      console.error('Błąd pobierania danych', err);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await partnerService.update(id, { ...partner, status: newStatus });
      fetchData();
    } catch (err) {
      alert('Błąd aktualizacji statusu.');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await contactService.create({ ...contactForm, employer: { id: parseInt(id) } });
      setContactForm({ firstName: '', lastName: '', email: '', phoneNumber: '', position: '', note: '' });
      setShowContactForm(false);
      fetchData();
    } catch (err) {
      alert('Błąd dodawania osoby.');
    }
  };

  const handleDeleteContact = async (contactId, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć ${name}?`)) {
      try {
        await contactService.delete(contactId);
        fetchData();
      } catch (err) {
        alert('Błąd usuwania. Tylko administrator może usunąć osobę kontaktową.');
      }
    }
  };

  const startEditContact = (c) => {
    setEditingContactId(c.id);
    setEditForm({
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      email: c.email || '',
      phoneNumber: c.phoneNumber || '',
      position: c.position || '',
    });
  };

  const handleSaveContact = async (contactId) => {
    try {
      await contactService.update(contactId, editForm);
      setEditingContactId(null);
      fetchData();
    } catch (err) {
      alert('Błąd zapisu osoby kontaktowej.');
    }
  };

  const handleAddNote = async (contactId) => {
    const content = noteInputs[contactId]?.trim();
    if (!content) return;
    try {
      await contactNoteService.create(contactId, content);
      setNoteInputs({ ...noteInputs, [contactId]: '' });
      setExpandedNoteContact(null);
      const res = await contactNoteService.getByContact(contactId);
      setContactNotes({ ...contactNotes, [contactId]: res.data });
    } catch (err) {
      alert('Błąd dodawania notatki.');
    }
  };

  const handleDeleteNote = async (contactId, noteId) => {
    if (!window.confirm('Usunąć notatkę?')) return;
    try {
      await contactNoteService.delete(contactId, noteId);
      const res = await contactNoteService.getByContact(contactId);
      setContactNotes({ ...contactNotes, [contactId]: res.data });
    } catch (err) {
      alert('Błąd usuwania notatki.');
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        partner: { id: parseInt(id) },
        event: form.eventId ? { id: parseInt(form.eventId) } : null,
        date: form.date + ':00',
      };
      await interactionService.create(data);
      setForm({ ...form, note: '', eventId: '' });
      fetchData();
    } catch (err) {
      alert('Błąd zapisu kontaktu.');
    }
  };

  if (!partner) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-4 w-48 bg-gray-100 rounded-lg mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/partners" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Powrót do bazy
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="page-title">{partner.name || '(bez nazwy)'}</h1>
            <p className="page-subtitle">{partner.industry || 'Brak branży'}</p>
          </div>

          <div className="flex items-center gap-3 card px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
            <select
              className="text-sm font-semibold bg-transparent border-0 outline-none cursor-pointer text-gray-700 focus:ring-0 p-0"
              value={partner.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
            >
              <option value="POTENTIAL">Potencjalny</option>
              <option value="ACTIVE">Aktywny Partner</option>
              <option value="BLACKLISTED">Czarna lista</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-600 rounded-full" />
              Historia aktywności
            </h2>

            <div className="relative pl-8 border-l-2 border-gray-100 space-y-6">
              {interactions.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[41px] top-0.5 w-5 h-5 bg-white border-4 border-indigo-500 rounded-full" />

                  <div className="card p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm">{INTERACTION_ICONS[item.type] || '📋'}</span>
                        <span className="badge bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleString('pl-PL', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {item.event && (
                        <span className="badge bg-indigo-50/50 text-indigo-500 border border-indigo-100 text-[11px] shrink-0">
                          {item.event.name}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{item.note}</p>

                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {item.member?.firstName?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs text-gray-400">
                        Notatka od: <span className="font-medium text-gray-500">{item.member?.firstName} {item.member?.lastName}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {interactions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-3xl mb-3">📭</div>
                  <p className="font-medium">Brak zarejestrowanych kontaktów.</p>
                  <p className="text-sm mt-1">Dodaj pierwszy kontakt w panelu po prawej.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Osoby kontaktowe</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {showContactForm ? 'Anuluj' : '+ Dodaj'}
              </button>
            </div>

            {showContactForm && (
              <form onSubmit={handleAddContact} className="mb-5 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Imię" className="input-field"
                    value={contactForm.firstName}
                    onChange={e => setContactForm({...contactForm, firstName: e.target.value})} required />
                  <input placeholder="Nazwisko" className="input-field"
                    value={contactForm.lastName}
                    onChange={e => setContactForm({...contactForm, lastName: e.target.value})} required />
                </div>
                <input placeholder="Email" className="input-field"
                  value={contactForm.email}
                  onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Telefon" className="input-field"
                    value={contactForm.phoneNumber}
                    onChange={e => setContactForm({...contactForm, phoneNumber: e.target.value})} />
                  <input placeholder="Stanowisko" className="input-field"
                    value={contactForm.position}
                    onChange={e => setContactForm({...contactForm, position: e.target.value})} />
                </div>
                <textarea className="input-field text-sm" rows="2" placeholder="Notatka (np. dobrze się współpracowało, kontakt nieaktualny...)"
                  value={contactForm.note}
                  onChange={e => setContactForm({...contactForm, note: e.target.value})} />
                <button className="btn-primary w-full text-xs">Zapisz osobę</button>
              </form>
            )}

            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {editingContactId === c.id ? (
                    <div className="space-y-2.5">
                      <input className="input-field text-sm" placeholder="Imię"
                        value={editForm.firstName}
                        onChange={e => setEditForm({...editForm, firstName: e.target.value})} />
                      <input className="input-field text-sm" placeholder="Nazwisko"
                        value={editForm.lastName}
                        onChange={e => setEditForm({...editForm, lastName: e.target.value})} />
                      <input className="input-field text-sm" placeholder="Email"
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="input-field text-sm" placeholder="Telefon"
                          value={editForm.phoneNumber}
                          onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} />
                        <input className="input-field text-sm" placeholder="Stanowisko"
                          value={editForm.position}
                          onChange={e => setEditForm({...editForm, position: e.target.value})} />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => handleSaveContact(c.id)} className="btn-primary text-xs flex-1">Zapisz</button>
                        <button onClick={() => setEditingContactId(null)} className="btn-secondary text-xs">Anuluj</button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {c.firstName?.charAt(0)}{c.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{c.firstName} {c.lastName}</div>
                          <div className="text-xs text-indigo-600 font-medium">{c.position || 'Pracownik'}</div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => startEditContact(c)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-100 text-gray-300 hover:text-indigo-600 transition-colors"
                            title="Edytuj">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteContact(c.id, `${c.firstName} ${c.lastName}`)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                            title="Usuń">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {c.email && (
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 ml-11 mb-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {c.email}
                        </div>
                      )}
                      <div className="ml-11 mt-2 space-y-2">
                        {(contactNotes[c.id] || []).length > 0 && (
                          <div className="border-t border-gray-200 pt-2 space-y-2">
                            {(contactNotes[c.id] || []).map((note) => (
                              <div key={note.id} className="bg-white rounded-lg border border-gray-100 p-2.5">
                                <p className="text-xs text-gray-700 leading-relaxed">{note.content}</p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center text-[7px] font-bold text-indigo-600">
                                      {note.author?.firstName?.charAt(0) || '?'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      {note.author?.firstName} {note.author?.lastName}
                                    </span>
                                    <span className="text-[10px] text-gray-300">·</span>
                                    <span className="text-[10px] text-gray-400">
                                      {new Date(note.createdAt).toLocaleString('pl-PL', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteNote(c.id, note.id)}
                                    className="text-[10px] text-gray-300 hover:text-red-400 transition-colors"
                                    title="Usuń notatkę"
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {expandedNoteContact === c.id ? (
                          <div className="flex gap-2">
                            <input
                              className="input-field text-xs flex-1"
                              placeholder="Treść notatki..."
                              value={noteInputs[c.id] || ''}
                              onChange={e => setNoteInputs({ ...noteInputs, [c.id]: e.target.value })}
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Enter') handleAddNote(c.id); }}
                            />
                            <button onClick={() => handleAddNote(c.id)} className="btn-primary text-xs px-3">OK</button>
                            <button onClick={() => { setExpandedNoteContact(null); setNoteInputs({ ...noteInputs, [c.id]: '' }); }} className="btn-secondary text-xs px-3">Anuluj</button>
                          </div>
                        ) : (
                          <button onClick={() => setExpandedNoteContact(c.id)} className="flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Dodaj notatkę
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6 italic">Brak osób kontaktowych</p>
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6 text-white">
            <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-5">Zarejestruj kontakt</h2>
            <form onSubmit={handleAddInteraction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Typ kontaktu</label>
                <select
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Telefon</option>
                  <option value="MEETING">Spotkanie</option>
                  <option value="LINKEDIN">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Notatka</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
                  rows="3"
                  placeholder="O czym rozmawialiście?"
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  required
                />
              </div>

              {events.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Powiązane wydarzenie (opcjonalne)</label>
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none px-3 py-2.5"
                    value={form.eventId}
                    onChange={e => setForm({ ...form, eventId: e.target.value })}
                  >
                    <option value="">Brak</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name} ({ev.edition})</option>
                    ))}
                  </select>
                </div>
              )}

              <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-900/30">
                Zapisz w historii
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
