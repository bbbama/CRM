import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partnerService } from '../services/api';

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POTENTIAL: 'bg-amber-50 text-amber-700 border-amber-200',
  BLACKLISTED: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABELS = {
  ACTIVE: 'Aktywny',
  POTENTIAL: 'Potencjalny',
  BLACKLISTED: 'Czarna lista',
};

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await partnerService.getAll();
      setPartners(res.data);
    } catch (err) {
      console.error('Błąd pobierania partnerów', err);
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await partnerService.create({ name: newName, industry: newIndustry, status: 'POTENTIAL' });
      setNewName('');
      setNewIndustry('');
      setShowQuickAdd(false);
      fetchPartners();
    } catch (err) {
      alert('Błąd podczas dodawania firmy.');
    }
  };

  const handleDeletePartner = async (id, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć firmę "${name}"?`)) {
      try {
        await partnerService.delete(id);
        fetchPartners();
      } catch (err) {
        alert('Błąd podczas usuwania. Tylko administrator może usunąć firmę.');
      }
    }
  };

  const filteredPartners = partners.filter(p =>
    p.name && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.industry || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Baza Partnerów</h1>
          <p className="page-subtitle">Zarządzaj relacjami z firmami i sponsorami</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Szukaj firmy lub branży..."
              className="input-field pl-10 w-56"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="btn-primary">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Dodaj firmę
          </button>
        </div>
      </div>

      {showQuickAdd && (
        <div className="card p-5 mb-8 border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white">
          <form onSubmit={handleAddPartner} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nazwa firmy</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="input-field"
                placeholder="np. Google"
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Branża</label>
              <input
                value={newIndustry}
                onChange={e => setNewIndustry(e.target.value)}
                className="input-field"
                placeholder="np. IT / Technologie"
                required
              />
            </div>
            <button className="btn-primary w-full sm:w-auto">
              Dodaj do bazy
            </button>
          </form>
        </div>
      )}

      {filteredPartners.length === 0 ? (
        <div className="text-center py-20 card border-dashed border-2 border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">Nie znaleziono firm spełniających kryteria.</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn-secondary mt-4">
              Wyczyść wyszukiwanie
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPartners.map(p => (
            <div key={p.id} className="group card-hover p-5 relative">
              <Link to={`/partners/${p.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                    {p.name?.charAt(0) || '?'}
                  </div>
                  <span className={`badge border ${STATUS_STYLES[p.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {STATUS_LABELS[p.status] || p.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mb-5">{p.industry}</p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Kliknij, aby zobaczyć szczegóły</span>
                  <span className="text-indigo-500 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); handleDeletePartner(p.id, p.name); }}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                title="Usuń firmę"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Partners;
