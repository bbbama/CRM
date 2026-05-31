import React, { useState, useEffect } from 'react';
import { memberService } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'MEMBER' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await memberService.getAll();
      setUsers(res.data);
    } catch (e) {
      alert("Błąd: Nie udało się pobrać listy członków. Prawdopodobnie brak uprawnień Admina.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await memberService.create(form);
      alert("Dodano nowego użytkownika");
      fetchUsers();
    } catch (err) {
      alert("Błąd podczas dodawania użytkownika");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Członkowie Stowarzyszenia</h2>
      
      {/* Formularz dodawania użytkownika */}
      <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
          <input 
            placeholder="Imię" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setForm({...form, firstName: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            placeholder="email@agh.pl" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setForm({...form, password: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rola</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setForm({...form, role: e.target.value})}
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
            <option value="GUEST">Guest</option>
          </select>
        </div>
        <button className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-semibold h-10">
          Dodaj Członka
        </button>
      </form>

      {/* Lista użytkowników w formie kart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center border hover:border-indigo-300 transition">
            <div>
              <p className="font-bold text-gray-800 text-lg">{u.firstName} {u.lastName}</p>
              <p className="text-sm text-gray-500 mb-2">{u.email}</p>
              <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                u.role === 'MEMBER' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {u.role}
              </span>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 italic">Brak użytkowników do wyświetlenia.</div>
        )}
      </div>
    </div>
  );
};

export default Users;
