import React from 'react';

const AddContactForm = ({ form, onFormChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="mb-5 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <input placeholder="Imię" className="input-field"
        value={form.firstName}
        onChange={e => onFormChange('firstName', e.target.value)} required />
      <input placeholder="Nazwisko" className="input-field"
        value={form.lastName}
        onChange={e => onFormChange('lastName', e.target.value)} required />
    </div>
    <input placeholder="Email" className="input-field"
      value={form.email}
      onChange={e => onFormChange('email', e.target.value)} />
    <div className="grid grid-cols-2 gap-3">
      <input placeholder="Telefon" className="input-field"
        value={form.phoneNumber}
        onChange={e => onFormChange('phoneNumber', e.target.value)} />
      <input placeholder="Stanowisko" className="input-field"
        value={form.position}
        onChange={e => onFormChange('position', e.target.value)} />
    </div>
    <textarea className="input-field text-sm" rows="2" placeholder="Notatka (np. dobrze się współpracowało, kontakt nieaktualny...)"
      value={form.note}
      onChange={e => onFormChange('note', e.target.value)} />
    <div className="flex gap-2">
      <button className="btn-primary flex-1 text-xs">Zapisz osobę</button>
      {onCancel && <button type="button" onClick={onCancel} className="btn-secondary text-xs">Anuluj</button>}
    </div>
  </form>
);

export default AddContactForm;
