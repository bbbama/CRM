import React, { useState, useEffect } from 'react';
import { memberService } from '../services/api';

const ROLE_STYLES = {
  ADMIN: 'bg-red-50 text-red-600 border-red-200',
  MEMBER: 'bg-blue-50 text-blue-600 border-blue-200',
  GUEST: 'bg-gray-50 text-gray-500 border-gray-200',
};

const ROLE_LABELS = {
  ADMIN: 'Admin',
  MEMBER: 'Członek',
  GUEST: 'Gość',
};

const Users = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'MEMBER',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await memberService.getAll();
      setMembers(res.data);
    } catch (err) {
      console.error('Błąd pobierania użytkowników', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      try {
        await memberService.delete(id);
        fetchMembers();
      } catch (err) {
        alert('Błąd podczas usuwania. Tylko Admin może to zrobić.');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await memberService.create(form);
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'MEMBER' });
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      alert('Błąd podczas dodawania użytkownika.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Zespół</h1>
          <p className="page-subtitle">Zarządzaj dostępem członków do systemu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Anuluj' : 'Dodaj członka'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Nowy użytkownik</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Imię"
                className="input-field"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <input
                placeholder="Nazwisko"
                className="input-field"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email (Login)"
                className="input-field"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Hasło"
                className="input-field"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                className="input-field"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="MEMBER">Członek</option>
                <option value="ADMIN">Administrator</option>
                <option value="GUEST">Gość</option>
              </select>
              <button className="btn-primary w-full">Stwórz konto</button>
            </div>
          </form>
        </div>
      )}

      <div className="card divide-y divide-gray-100 overflow-hidden">
        {members.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-gray-500 font-medium">Brak członków w zespole.</p>
          </div>
        ) : (
          members.map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {m.firstName?.charAt(0)}{m.lastName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{m.firstName} {m.lastName}</h3>
                  <p className="text-xs text-gray-400 truncate">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`badge border text-[11px] font-semibold ${ROLE_STYLES[m.role] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {ROLE_LABELS[m.role] || m.role}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-xs font-medium text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
