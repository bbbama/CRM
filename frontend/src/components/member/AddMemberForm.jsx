import React from 'react';

const AddMemberForm = ({ form, onFormChange, onSubmit }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
    <h2 className="text-base font-semibold text-gray-900 mb-6">Nowy użytkownik</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="Imię"
          className="input-field"
          value={form.firstName}
          onChange={e => onFormChange({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Nazwisko"
          className="input-field"
          value={form.lastName}
          onChange={e => onFormChange({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email (Login)"
          className="input-field"
          value={form.email}
          onChange={e => onFormChange({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          className="input-field"
          value={form.password}
          onChange={e => onFormChange({ ...form, password: e.target.value })}
          required
        />
        <select
          className="input-field"
          value={form.role}
          onChange={e => onFormChange({ ...form, role: e.target.value })}
        >
          <option value="MEMBER">Członek</option>
          <option value="ADMIN">Administrator</option>
          <option value="GUEST">Gość</option>
        </select>
        <button className="btn-primary w-full">Stwórz konto</button>
      </div>
    </form>
  </div>
);

export default AddMemberForm;
