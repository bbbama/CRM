import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { partnerService, interactionService, eventService, contactService } from '../services/api';

const PartnerDetails = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Formularz nowej interakcji
  const [form, setForm] = useState({
    type: 'EMAIL',
    date: new Date().toISOString().slice(0, 16), // format YYYY-MM-DDTHH:mm
    note: '',
    eventId: '',
    status: 'IN_PROGRESS',
    isResponsive: true
  });

  // Formularz nowego kontaktu w firmie
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    linkedinUrl: ''
  });

  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [partnerRes, interactionsRes, eventsRes, contactsRes] = await Promise.all([
        partnerService.getById(id),
        interactionService.getByPartner(id),
        eventService.getAll(),
        contactService.getByPartner(id)
      ]);
      setPartner(partnerRes.data);
      setInteractions(interactionsRes.data);
      setEvents(eventsRes.data);
      setContacts(contactsRes.data);
    } catch (err) {
      console.error("Błąd pobierania danych partnera", err);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const contactData = {
        ...contactForm,
        employer: { id: parseInt(id) }
      };
      await contactService.create(contactData);
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        position: '',
        linkedinUrl: ''
      });
      setShowContactForm(false);
      fetchData();
    } catch (err) {
      alert("Błąd podczas dodawania osoby kontaktowej.");
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const interactionData = {
        ...form,
        partner: { id: parseInt(id) },
        event: form.eventId ? { id: parseInt(form.eventId) } : null,
        // Backend oczekuje formatu ISO dla LocalDateTime
        date: form.date + ":00" 
      };
      await interactionService.create(interactionData);
      setForm({ ...form, note: '', eventId: '' });
      fetchData();
    } catch (err) {
      alert("Błąd podczas dodawania interakcji. Sprawdź czy wszystkie dane są poprawne.");
    }
  };

  if (!partner) return <div className="p-8 text-center text-gray-500 italic">Ładowanie danych partnera...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Nagłówek i Powrót */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/partners" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold mb-2 block">
            &larr; Powrót do listy partnerów
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">{partner.name}</h2>
          <p className="text-gray-500">{partner.industry} | {partner.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lewa kolumna: Historia interakcji */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Historia kontaktów</h3>
          <div className="space-y-4">
            {interactions.map(idx => (
              <div key={idx.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500 border">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
                      {idx.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(idx.date).toLocaleString()}
                    </span>
                  </div>
                  {idx.event && (
                    <span className="text-xs font-semibold text-gray-400">
                      Dotyczy: {idx.event.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{idx.note}</p>
                <div className="mt-2 text-xs text-gray-400 italic">
                   Przez: {idx.member?.firstName || "Nieznany"}
                </div>
              </div>
            ))}
            {interactions.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic bg-white rounded-lg border">
                Brak historii interakcji z tym partnerem.
              </div>
            )}
          </div>
        </div>

        {/* Prawa kolumna: Osoby kontaktowe i Formularz nowej interakcji */}
        <div className="space-y-6">
          
          {/* SEKCJA: OSOBY KONTAKTOWE */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Osoby kontaktowe</h3>
              <button 
                onClick={() => setShowContactForm(!showContactForm)}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition"
              >
                {showContactForm ? 'Anuluj' : '+ Dodaj'}
              </button>
            </div>

            {showContactForm && (
              <form onSubmit={handleAddContact} className="mb-6 space-y-3 bg-gray-50 p-4 rounded-md border border-indigo-100">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    placeholder="Imię" 
                    className="p-2 border rounded text-sm w-full"
                    value={contactForm.firstName}
                    onChange={e => setContactForm({...contactForm, firstName: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Nazwisko" 
                    className="p-2 border rounded text-sm w-full"
                    value={contactForm.lastName}
                    onChange={e => setContactForm({...contactForm, lastName: e.target.value})}
                    required
                  />
                </div>
                <input 
                  placeholder="Stanowisko" 
                  className="p-2 border rounded text-sm w-full"
                  value={contactForm.position}
                  onChange={e => setContactForm({...contactForm, position: e.target.value})}
                />
                <input 
                  placeholder="Email" 
                  type="email"
                  className="p-2 border rounded text-sm w-full"
                  value={contactForm.email}
                  onChange={e => setContactForm({...contactForm, email: e.target.value})}
                />
                <input 
                  placeholder="Telefon" 
                  className="p-2 border rounded text-sm w-full"
                  value={contactForm.phoneNumber}
                  onChange={e => setContactForm({...contactForm, phoneNumber: e.target.value})}
                />
                <input 
                  placeholder="LinkedIn (URL)" 
                  className="p-2 border rounded text-sm w-full"
                  value={contactForm.linkedinUrl}
                  onChange={e => setContactForm({...contactForm, linkedinUrl: e.target.value})}
                />
                <button className="w-full bg-indigo-600 text-white p-2 rounded text-sm font-bold hover:bg-indigo-700">
                  Zapisz osobę
                </button>
              </form>
            )}

            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="p-3 border rounded-lg hover:border-indigo-300 transition-colors bg-white">
                  <div className="font-bold text-gray-800">{c.firstName} {c.lastName}</div>
                  <div className="text-xs text-indigo-600 font-semibold mb-2">{c.position || 'Pracownik'}</div>
                  <div className="text-xs space-y-1 text-gray-600">
                    {c.email && <div className="flex items-center gap-1">✉ {c.email}</div>}
                    {c.phoneNumber && <div className="flex items-center gap-1">📞 {c.phoneNumber}</div>}
                    {c.linkedinUrl && (
                      <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                        🔗 LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && !showContactForm && (
                <p className="text-sm text-gray-400 italic text-center py-4">Brak dodanych osób kontaktowych.</p>
              )}
            </div>
          </div>

          {/* FORMULARZ INTERAKCJI */}
          <div className="bg-gray-50 p-6 rounded-lg border h-fit shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Zarejestruj kontakt</h3>
            <form onSubmit={handleAddInteraction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ kontaktu</label>
                <select 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Telefon</option>
                  <option value="MEETING">Spotkanie</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="OTHER">Inne</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data i godzina</label>
                <input 
                  type="datetime-local"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Powiązane wydarzenie</label>
                <select 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.eventId}
                  onChange={e => setForm({...form, eventId: e.target.value})}
                >
                  <option value="">-- Brak / Inne --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name} ({ev.edition})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notatka</label>
                <textarea 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows="4"
                  placeholder="O czym rozmawialiście? Jakie ustalenia?"
                  value={form.note}
                  onChange={e => setForm({...form, note: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="responsive"
                  checked={form.isResponsive}
                  onChange={e => setForm({...form, isResponsive: e.target.checked})}
                />
                <label htmlFor="responsive" className="text-sm text-gray-700">Czy partner odpowiedział?</label>
              </div>
              <button className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-semibold">
                Zapisz interakcję
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetails;
