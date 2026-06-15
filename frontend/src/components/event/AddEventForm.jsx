import React from 'react';

const AddEventForm = ({ form, onFormChange, onSubmit, onCancel, isEditing = false }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
    <h2 className="text-base font-semibold text-gray-900 mb-6">
      {isEditing ? 'Edytuj wydarzenie' : 'Dodaj nowe wydarzenie'}
    </h2>
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nazwa wydarzenia</label>
          <input
            type="text"
            value={form.name || ''}
            onChange={e => onFormChange({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="np. Inżynierskie Targi Pracy"
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">Anuluj</button>
        )}
        <button className="btn-primary">{isEditing ? 'Zapisz zmiany' : 'Zapisz wydarzenie'}</button>
      </div>
    </form>
  </div>
);

export default AddEventForm;
