import React from 'react';

const EVENT_FIELDS = [
  { key: 'name', label: 'Nazwa projektu', placeholder: 'np. Inżynierskie Targi Pracy', colSpan: 'sm:col-span-2', required: true },
  { key: 'edition', label: 'Edycja (Rok)', placeholder: '2024', type: 'number', required: true },
  { key: 'localisation', label: 'Miejsce', placeholder: 'np. Kampus AGH' },
  { key: 'startingDate', label: 'Data rozpoczęcia', type: 'date', required: true },
  { key: 'endingDate', label: 'Data zakończenia', type: 'date' },
  { key: 'description', label: 'Opis', placeholder: 'Krótki cel wydarzenia...' },
];

const AddEventForm = ({ form, onFormChange, onSubmit }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
    <h2 className="text-base font-semibold text-gray-900 mb-6">Dodaj nowe wydarzenie</h2>
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVENT_FIELDS.map(({ key, label, placeholder, type, colSpan, required }) => (
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
      <div className="flex justify-end pt-2">
        <button className="btn-primary">Zapisz wydarzenie</button>
      </div>
    </form>
  </div>
);

export default AddEventForm;
