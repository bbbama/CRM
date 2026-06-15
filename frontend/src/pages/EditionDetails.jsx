import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEditionDetails } from '../hooks/useEditionDetails';
import { editionService } from '../services/api';
import { PageLayout, BackLink, EmptyState } from '../components/ui';

const STATUS_LABELS = {
  IN_PROGRESS: 'Zastanawia się',
  ACCEPTED: 'Chce wejść',
  REJECTED: 'Nie chce wejść',
};

const STATUS_COLORS = {
  IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  ACCEPTED: 'bg-green-50 text-green-700 border-green-100',
  REJECTED: 'bg-red-50 text-red-700 border-red-100',
};

const PartnerCard = ({ eventId, editionId, assignmentId, ap, updateStatus, removePartner }) => {
  const [showForm, setShowForm] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [interactionType, setInteractionType] = useState('');
  const [interactionNote, setInteractionNote] = useState('');

  const loadInteractions = async () => {
    try {
      const res = await editionService.getInteractions(eventId, editionId, assignmentId, ap.partner.id);
      setInteractions(res.data);
      setShowForm(!showForm);
    } catch (err) {
      console.error(err);
    }
  };

  const addInteraction = async () => {
    if (!interactionType) return;
    try {
      await editionService.addInteraction(eventId, editionId, assignmentId, ap.partner.id, interactionType, interactionNote);
      setInteractionType('');
      setInteractionNote('');
      loadInteractions();
    } catch (err) {
      alert('Błąd dodawania interakcji.');
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{ap.partner.name}</span>
          <button
            onClick={() => removePartner(assignmentId, ap.partner.id)}
            className="text-red-400 hover:text-red-600 text-sm"
            title="Usuń firmę"
          >×</button>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={ap.status}
            onChange={e => updateStatus(assignmentId, ap.partner.id, e.target.value)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[ap.status] || ''}`}
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={loadInteractions} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        {showForm ? 'Ukryj' : 'Pokaż interakcje'}
      </button>

      {showForm && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {['EMAIL', 'PHONE', 'MEETING', 'LINKEDIN', 'OTHER'].map(t => (
              <button
                key={t}
                onClick={() => setInteractionType(t)}
                className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${
                  interactionType === t
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {t === 'EMAIL' ? 'Mail' : t === 'PHONE' ? 'Telefon' : t === 'MEETING' ? 'Spotkanie' : t === 'LINKEDIN' ? 'LinkedIn' : 'Inne'}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={interactionNote}
            onChange={e => setInteractionNote(e.target.value)}
            placeholder="Notatka (opcjonalnie)"
            className="input-field text-sm"
          />
          <button onClick={addInteraction} disabled={!interactionType} className="btn-primary text-sm">
            Dodaj interakcję
          </button>

          {interactions.length > 0 && (
            <div className="space-y-2 mt-3">
              {interactions.map(ix => (
                <div key={ix.id} className="bg-white rounded-lg border border-gray-100 p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {ix.type}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {ix.date && new Date(ix.date).toLocaleString('pl-PL')}
                    </span>
                  </div>
                  {ix.note && <p className="text-gray-600">{ix.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EditionDetails = () => {
  const { id: eventId, editionId } = useParams();
  const {
    event, edition, assignments, members, partners,
    selectedMember, setSelectedMember,
    partnerSelections, setPartnerSelections,
    addAssignment, removeAssignment,
    addPartner, removePartner, updateStatus,
  } = useEditionDetails(eventId, editionId);

  if (!event || !edition) {
    return (
      <PageLayout>
        <div className="text-center py-20 text-gray-400">Ładowanie...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="mb-8">
        <BackLink to={`/events/${eventId}`}>Powrót do wydarzenia</BackLink>
        <h1 className="page-title">
          {event.name} — Edycja {edition.edition}
        </h1>
        <p className="page-subtitle">
          {edition.startingDate && new Date(edition.startingDate).toLocaleDateString('pl-PL')}
          {edition.endingDate && ` — ${new Date(edition.endingDate).toLocaleDateString('pl-PL')}`}
          {edition.localisation && ` · ${edition.localisation}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Dodaj użytkownika</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Użytkownik</label>
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              className="input-field min-w-[220px]"
            >
              <option value="">— Wybierz użytkownika —</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
              ))}
            </select>
          </div>
          <button onClick={addAssignment} disabled={!selectedMember} className="btn-primary">
            Dodaj
          </button>
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-900 mb-4">Przypisani użytkownicy</h2>
      {assignments.length === 0 ? (
        <EmptyState icon="" title="Brak przypisanych użytkowników." />
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-lg">
                  {a.member?.firstName} {a.member?.lastName}
                </span>
                <button
                  onClick={() => removeAssignment(a.id)}
                  className="text-red-400 hover:text-red-600 text-sm font-medium"
                >
                  Usuń użytkownika
                </button>
              </div>

              <div className="space-y-3 mb-3">
                {a.assignedPartners && a.assignedPartners.length > 0 ? a.assignedPartners.map(ap => (
                  <PartnerCard
                    key={ap.id}
                    eventId={eventId}
                    editionId={editionId}
                    assignmentId={a.id}
                    ap={ap}
                    updateStatus={updateStatus}
                    removePartner={removePartner}
                  />
                )) : (
                  <span className="text-sm text-gray-400">Brak przypisanych firm</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-gray-50">
                <select
                  value={partnerSelections[a.id] || ''}
                  onChange={e => setPartnerSelections(prev => ({ ...prev, [a.id]: e.target.value }))}
                  className="input-field text-sm min-w-[180px]"
                >
                  <option value="">— Dodaj firmę —</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => addPartner(a.id)}
                  disabled={!partnerSelections[a.id]}
                  className="btn-primary text-sm"
                >
                  + Firmę
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default EditionDetails;
