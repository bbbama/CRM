import React from 'react';

const PartnerQuickAdd = ({ newName, newIndustry, onNameChange, onIndustryChange, onSubmit, onCancel }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white">
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Nazwa firmy</label>
        <input
          value={newName}
          onChange={e => onNameChange(e.target.value)}
          className="input-field"
          placeholder="np. Google"
          required
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Branża</label>
        <input
          value={newIndustry}
          onChange={e => onIndustryChange(e.target.value)}
          className="input-field"
          placeholder="np. IT / Technologie"
          required
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button className="btn-primary w-full sm:w-auto">Dodaj do bazy</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">Anuluj</button>
        )}
      </div>
    </form>
  </div>
);

export default PartnerQuickAdd;
