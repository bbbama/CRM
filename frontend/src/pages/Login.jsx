import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/partners');
    } catch (err) {
      alert("Błąd logowania. Sprawdź dane.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Zaloguj się</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            placeholder="twoj@email.pl" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-semibold">
          Wejdź
        </button>
      </form>
    </div>
  );
};

export default Login;
