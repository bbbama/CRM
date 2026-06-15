import React from 'react';

const EDITION_FIELDS = [
  { key: 'edition', label: 'Edycja (Rok)', placeholder: '2024', type: 'number', required: true, colSpan: '' },
  { key: 'startingDate', label: 'Data rozpoczęcia', type: 'date', required: true, colSpan: '' },
  { key: 'endingDate', label: 'Data zakończenia', type: 'date', colSpan: '' },
  { key: 'localisation', label: 'Miejsce', placeholder: 'np. Kampus AGH', colSpan: 'sm:col-span-2' },
  { key: 'description', label: 'Opis', placeholder: 'Krótki cel wydarzenia...', colSpan: 'sm:col-span-2' },
];

const AddEditionForm = ({ form, onFormChange, onSubmit, onCancel, isEditing = false }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 className="text-base font-semibold text-gray-900 mb-6">
      {isEditing ? 'Edytuj edycję' : 'Dodaj nową edycję'}
    </h2>
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EDITION_FIELDS.map(({ key, label, placeholder, type, colSpan, required }) => (
          <div key={key} className={colSpan || ''}>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
            <input
              type={type || 'text'}
              value={form[key] || ''}
              onChange={e => onFormChange({ ...form, [key]: e.target.value })}
              className="input-field"
              placeholder={placeholder}
              required={required}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Anuluj
          </button>
        )}
        <button className="btn-primary">
          {isEditing ? 'Zapisz zmiany' : 'Dodaj edycję'}
        </button>
      </div>
    </form>
  </div>
);

export default AddEditionForm;
