import React from 'react';
import Avatar from '../ui/Avatar';
import IconButton from '../ui/IconButton';
import ContactNoteList from './ContactNoteList';

const ContactCard = ({
  contact,
  isEditing,
  editForm,
  onEditFormChange,
  onSave,
  onCancelEdit,
  onStartEdit,
  onDelete,
  notes,
  noteInput,
  onNoteChange,
  showNoteInput,
  onShowNoteInput,
  onHideNoteInput,
  onAddNote,
  onDeleteNote,
}) => {
  if (!contact) return null;

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="space-y-2.5">
          <input className="input-field text-sm" placeholder="Imię"
            value={editForm.firstName}
            onChange={e => onEditFormChange({ ...editForm, firstName: e.target.value })} />
          <input className="input-field text-sm" placeholder="Nazwisko"
            value={editForm.lastName}
            onChange={e => onEditFormChange({ ...editForm, lastName: e.target.value })} />
          <input className="input-field text-sm" placeholder="Email"
            value={editForm.email}
            onChange={e => onEditFormChange({ ...editForm, email: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input-field text-sm" placeholder="Telefon"
              value={editForm.phoneNumber}
              onChange={e => onEditFormChange({ ...editForm, phoneNumber: e.target.value })} />
            <input className="input-field text-sm" placeholder="Stanowisko"
              value={editForm.position}
              onChange={e => onEditFormChange({ ...editForm, position: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => onSave(contact.id)} className="btn-primary text-xs flex-1">Zapisz</button>
            <button onClick={onCancelEdit} className="btn-secondary text-xs">Anuluj</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="group relative">
        <div className="flex items-center gap-3 mb-2">
          <Avatar name={`${contact.firstName} ${contact.lastName}`} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{contact.firstName} {contact.lastName}</div>
            <div className="text-xs text-indigo-600 font-medium">{contact.position || 'Pracownik'}</div>
          </div>
          <div className="flex gap-1 shrink-0">
            <IconButton icon="edit" onClick={() => onStartEdit(contact)} title="Edytuj" />
            <IconButton icon="delete" onClick={() => onDelete(contact.id, `${contact.firstName} ${contact.lastName}`)} title="Usuń" />
          </div>
        </div>
        {contact.email && (
          <div className="text-xs text-gray-400 flex items-center gap-1.5 ml-11 mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {contact.email}
          </div>
        )}
        <ContactNoteList
          notes={notes}
          onDelete={onDeleteNote}
          onAdd={() => onAddNote(contact.id)}
          newNote={noteInput}
          onNoteChange={onNoteChange}
          showInput={showNoteInput}
          onShowInput={onShowNoteInput}
          onHideInput={onHideNoteInput}
        />
      </div>
    </div>
  );
};

export default ContactCard;
