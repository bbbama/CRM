import { useEvents } from '../hooks';
import { PageHeader, PageLayout, EmptyState, CardGrid, Button } from '../components/ui';
import { EventCard, AddEventForm } from '../components';

const Events = () => {
  const {
    events, showForm, setShowForm, form, setForm,
    editingId, isAdmin,
    addEvent, startEdit, saveEdit, deleteEvent, handleCancel,
  } = useEvents();

  return (
    <PageLayout>
      <PageHeader
        title="Projekty i Wydarzenia"
        subtitle="Zarządzaj eventami, na które szukamy sponsorów"
        action={
          isAdmin && (
            <Button icon="add" onClick={() => { setShowForm(!showForm); if (!showForm) { setForm({ name: '' }); } }}>
              {showForm ? 'Anuluj' : 'Nowe Wydarzenie'}
            </Button>
          )
        }
      />

      {showForm && (
        <AddEventForm
          form={form}
          onFormChange={setForm}
          onSubmit={editingId ? saveEdit : addEvent}
          onCancel={handleCancel}
          isEditing={!!editingId}
        />
      )}

      {events.length === 0 && !showForm ? (
        <EmptyState
          icon="📅"
          title="Brak zaplanowanych wydarzeń."
          action={isAdmin ? <Button onClick={() => setShowForm(true)}>Dodaj pierwsze wydarzenie</Button> : null}
        />
      ) : (
        <div>
          <CardGrid>
            {events.map(event => (
              <div key={event.id} className="relative group">
                <EventCard event={event} />
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(event); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edytuj"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Usuń"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </CardGrid>
        </div>
      )}
    </PageLayout>
  );
};

export default Events;
