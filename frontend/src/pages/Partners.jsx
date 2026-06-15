import { usePartners } from '../hooks';
import { PageHeader, PageLayout, SearchInput, EmptyState, CardGrid, Button } from '../components/ui';
import { PartnerCard, PartnerQuickAdd } from '../components';

const Partners = () => {
  const role = localStorage.getItem('role');
  const canModify = role === 'ADMIN' || role === 'MEMBER';

  const {
    partners, searchTerm, setSearchTerm,
    newName, setNewName, newIndustry, setNewIndustry,
    showQuickAdd, setShowQuickAdd,
    addPartner, deletePartner,
  } = usePartners();

  return (
    <PageLayout>
      <PageHeader
        title="Baza Partnerów"
        subtitle="Zarządzaj relacjami z firmami i sponsorami"
        action={
          <div className="flex gap-3">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Szukaj firmy lub branży..." />
            {canModify && (
              <Button icon="add" onClick={() => setShowQuickAdd(!showQuickAdd)}>
                {showQuickAdd ? 'Anuluj' : 'Dodaj firmę'}
              </Button>
            )}
          </div>
        }
      />

      {showQuickAdd && (
        <PartnerQuickAdd
          newName={newName} newIndustry={newIndustry}
          onNameChange={setNewName} onIndustryChange={setNewIndustry}
          onSubmit={addPartner} onCancel={() => setShowQuickAdd(false)}
        />
      )}

      {partners.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Nie znaleziono firm spełniających kryteria."
          action={searchTerm && (
            <Button variant="secondary" onClick={() => setSearchTerm('')}>Wyczyść wyszukiwanie</Button>
          )}
        />
      ) : (
        <CardGrid>
          {partners.map(p => (
            <PartnerCard key={p.id} partner={p} onDelete={deletePartner} />
          ))}
        </CardGrid>
      )}
    </PageLayout>
  );
};

export default Partners;
