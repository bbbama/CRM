import React from 'react';
import { Avatar, StatusBadge, IconButton } from '../ui';

const MemberListItem = ({ member, onDelete }) => {
  if (!member) return null;
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  return (
    <div className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar
          name={`${member.firstName} ${member.lastName}`}
          size="md"
          className="bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{member.firstName} {member.lastName}</h3>
          <p className="text-xs text-gray-400 truncate">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <StatusBadge status={member.role} />
        {isAdmin && <IconButton icon="delete" onClick={() => onDelete(member.id)} title="Usuń użytkownika" />}
      </div>
    </div>
  );
};

export default MemberListItem;
