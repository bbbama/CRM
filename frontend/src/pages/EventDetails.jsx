import { useParams } from 'react-router-dom';
import { useEventDetails } from '../hooks/useEventDetails';
import { PageLayout, SkeletonLoader, BackLink, Button, EmptyState, DataCard } from '../components/ui';
import { EditionCard, AddEditionForm } from '../components';

const EventDetails = () => {
  const { id } = useParams();
  const {
    event, editions, showForm, setShowForm, form, setForm,
    editingId, isAdmin,
    addEdition, startEdit, saveEdit, deleteEdition, handleCancel,
  } = useEventDetails(id);

  if (!event) {
    return (
      <PageLayout>
        <div className="text-center py-20"><SkeletonLoader lines={2} /></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="5xl">
      <div className="mb-8">
        <BackLink to="/events">Powrót do wydarzeń</BackLink>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="page-title">{event.name}</h1>
            <p className="page-subtitle">{editions.length} edycji</p>
          </div>
          {isAdmin && (
            <Button
              icon="add"
              onClick={() => { setShowForm(!showForm); if (!showForm) setForm({ edition: '', startingDate: '', endingDate: '', localisation: '', description: '' }); }}
            >
              {showForm ? 'Anuluj' : 'Dodaj edycję'}
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <AddEditionForm
          form={form}
          onFormChange={setForm}
          onSubmit={editingId ? saveEdit : addEdition}
          onCancel={handleCancel}
          isEditing={!!editingId}
        />
      )}

      {editions.length === 0 && !showForm ? (
        <EmptyState
          icon="📅"
          title="Brak edycji tego wydarzenia."
          action={isAdmin ? <Button onClick={() => setShowForm(true)}>Dodaj pierwszą edycję</Button> : null}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {editions.map(edition => (
            <EditionCard
              key={edition.id}
              edition={edition}
              onEdit={startEdit}
              onDelete={deleteEdition}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default EventDetails;
