import React from 'react';
import { Avatar, IconButton } from '../ui';

const ContactNoteItem = ({ note, onDelete, isAdmin }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-2.5">
    <p className="text-xs text-gray-700 leading-relaxed">{note.content}</p>
    <div className="flex items-center justify-between mt-1.5">
      <div className="flex items-center gap-1.5">
        <Avatar name={`${note.author?.firstName || ''} ${note.author?.lastName || ''}`} size="xs" />
        <span className="text-[10px] text-gray-400">
          {note.author?.firstName} {note.author?.lastName}
        </span>
        <span className="text-[10px] text-gray-300">·</span>
        <span className="text-[10px] text-gray-400">
          {new Date(note.createdAt).toLocaleString('pl-PL', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>
      {isAdmin && (
        <IconButton icon="close" onClick={() => onDelete(note.id)} size="sm" title="Usuń notatkę" />
      )}
    </div>
  </div>
);

const ContactNoteList = ({ notes = [], onDelete, onAdd, newNote, onNoteChange, showInput, onShowInput, onHideInput, isAdmin = false, canModify = false }) => (
  <div className="ml-11 mt-2 space-y-2">
    {notes.length > 0 && (
      <div className="border-t border-gray-200 pt-2 space-y-2">
        {notes.map(note => (
          <ContactNoteItem key={note.id} note={note} onDelete={onDelete} isAdmin={isAdmin} />
        ))}
      </div>
    )}
    {showInput ? (
      <div className="flex gap-2">
        <input
          className="input-field text-xs flex-1"
          placeholder="Treść notatki..."
          value={newNote || ''}
          onChange={e => onNoteChange(e.target.value)}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }}
        />
        <button onClick={onAdd} className="btn-primary text-xs px-3">OK</button>
        <button onClick={onHideInput} className="btn-secondary text-xs px-3">Anuluj</button>
      </div>
    ) : canModify ? (
      <button onClick={onShowInput} className="flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Dodaj notatkę
      </button>
    ) : null}
  </div>
);

export default ContactNoteList;
