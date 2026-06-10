import { useEvents } from '../hooks';
import { PageHeader, PageLayout, EmptyState, CardGrid, Button } from '../components/ui';
import { EventCard, AddEventForm } from '../components';

const Events = () => {
  const { events, showForm, setShowForm, form, setForm, addEvent } = useEvents();

  return (
    <PageLayout>
      <PageHeader
        title="Projekty i Wydarzenia"
        subtitle="Zarządzaj eventami, na które szukamy sponsorów"
        action={
          <Button icon="add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Anuluj' : 'Nowe Wydarzenie'}
          </Button>
        }
      />

      {showForm && <AddEventForm form={form} onFormChange={setForm} onSubmit={addEvent} />}

      {events.length === 0 && !showForm ? (
        <EmptyState
          icon="📅"
          title="Brak zaplanowanych wydarzeń."
          action={<Button onClick={() => setShowForm(true)}>Dodaj pierwsze wydarzenie</Button>}
        />
      ) : (
        <CardGrid>
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </CardGrid>
      )}
    </PageLayout>
  );
};

export default Events;
