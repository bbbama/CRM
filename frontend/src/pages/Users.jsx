import { useUsers } from '../hooks';
import { PageHeader, PageLayout, EmptyState, DataCard, Button } from '../components/ui';
import { MemberListItem, AddMemberForm } from '../components';

const Users = () => {
  const { members, showForm, setShowForm, form, setForm, addMember, deleteMember } = useUsers();

  return (
    <PageLayout maxWidth="5xl">
      <PageHeader
        title="Zespół"
        subtitle="Zarządzaj dostępem członków do systemu"
        action={
          <Button icon="add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Anuluj' : 'Dodaj członka'}
          </Button>
        }
      />

      {showForm && <AddMemberForm form={form} onFormChange={setForm} onSubmit={addMember} />}

      <DataCard padding="p-0" className="divide-y divide-gray-100 overflow-hidden">
        {members.length === 0 ? (
          <EmptyState icon="👥" title="Brak członków w zespole." className="py-16" />
        ) : (
          members.map(m => <MemberListItem key={m.id} member={m} onDelete={deleteMember} />)
        )}
      </DataCard>
    </PageLayout>
  );
};

export default Users;
