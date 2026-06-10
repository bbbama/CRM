import { useState, useEffect } from 'react';
import { memberService } from '../services/api';

export const useUsers = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'MEMBER',
  });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await memberService.getAll();
      setMembers(res.data);
    } catch (err) {
      console.error('Błąd pobierania użytkowników', err);
    }
  };

  const deleteMember = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      try {
        await memberService.delete(id);
        fetchMembers();
      } catch (err) {
        alert('Błąd podczas usuwania. Tylko Admin może to zrobić.');
      }
    }
  };

  const addMember = async (e) => {
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

  return {
    members, showForm, setShowForm, form, setForm,
    addMember, deleteMember, fetchMembers,
  };
};
