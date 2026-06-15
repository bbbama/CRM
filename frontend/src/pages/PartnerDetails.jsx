import { useParams } from 'react-router-dom';
import { usePartnerDetails } from '../hooks';
import { PageLayout, SkeletonLoader, DataCard, BackLink } from '../components/ui';
import { InteractionTimeline, InteractionForm, ContactCard, AddContactForm } from '../components';

const STATUS_OPTIONS = [
  { value: 'POTENTIAL', label: 'Potencjalny' },
  { value: 'ACTIVE', label: 'Aktywny Partner' },
  { value: 'BLACKLISTED', label: 'Czarna lista' },
];

const PartnerDetails = () => {
  const { id } = useParams();
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';
  const canModify = role === 'ADMIN' || role === 'MEMBER';
  const {
    partner, interactions, contacts, events,
    form, setForm,
    contactForm, setContactForm, showContactForm, setShowContactForm,
    editingContactId, editForm, setEditForm,
    contactNotes, noteInputs, setNoteInputs, expandedNoteContact, setExpandedNoteContact,
    updateStatus, addContact, deleteContact,
    startEditContact, saveContact,
    addNote, deleteNote, addInteraction,
  } = usePartnerDetails(id);

  if (!partner) {
    return (
      <PageLayout>
        <div className="text-center py-20"><SkeletonLoader lines={2} /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <BackLink to="/partners">Powrót do bazy</BackLink>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="page-title">{partner.name || '(bez nazwy)'}</h1>
            <p className="page-subtitle">{partner.industry || 'Brak branży'}</p>
          </div>
          <div className="flex items-center gap-3 card px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
            {isAdmin ? (
              <select
                className="text-sm font-semibold bg-transparent border-0 outline-none cursor-pointer text-gray-700 focus:ring-0 p-0"
                value={partner.status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-semibold text-gray-700">
                {STATUS_OPTIONS.find(o => o.value === partner.status)?.label || partner.status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InteractionTimeline interactions={interactions} />
        </div>

        <div className="space-y-6">
          <DataCard padding="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Osoby kontaktowe</h2>
              {canModify && (
                <button onClick={() => setShowContactForm(!showContactForm)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  {showContactForm ? 'Anuluj' : '+ Dodaj'}
                </button>
              )}
            </div>

            {showContactForm && (
              <AddContactForm
                form={contactForm}
                onFormChange={(f, v) => setContactForm(p => ({ ...p, [f]: v }))}
                onSubmit={addContact}
              />
            )}

            <div className="space-y-3">
              {contacts.map(c => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  isEditing={editingContactId === c.id}
                  editForm={editForm}
                  onEditFormChange={setEditForm}
                  onSave={saveContact}
                  onCancelEdit={() => setEditingContactId(null)}
                  onStartEdit={startEditContact}
                  onDelete={deleteContact}
                  notes={contactNotes[c.id] || []}
                  noteInput={noteInputs[c.id] || ''}
                  onNoteChange={(v) => setNoteInputs(p => ({ ...p, [c.id]: v }))}
                  showNoteInput={expandedNoteContact === c.id}
                  onShowNoteInput={() => setExpandedNoteContact(c.id)}
                  onHideNoteInput={() => { setExpandedNoteContact(null); setNoteInputs(p => ({ ...p, [c.id]: '' })); }}
                  onAddNote={addNote}
                  onDeleteNote={(noteId) => deleteNote(c.id, noteId)}
                  isAdmin={isAdmin}
                  canModify={canModify}
                />
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6 italic">Brak osób kontaktowych</p>
              )}
            </div>
          </DataCard>

          {canModify && <InteractionForm form={form} onFormChange={setForm} events={events} onSubmit={addInteraction} />}
        </div>
      </div>
    </PageLayout>
  );
};

export default PartnerDetails;
