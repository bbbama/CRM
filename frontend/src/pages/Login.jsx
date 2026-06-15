import React, { useState } from 'react';
import { authService } from '../services/api';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('admin@best.pl');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setAuth(true);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Nie można połączyć się z serwerem. Uruchom backend (Spring Boot) na porcie 8080.');
      } else if (err.response?.status === 401) {
        setError('Nieprawidłowy e-mail lub hasło. Spróbuj ponownie.');
      } else if (err.response?.status === 403) {
        setError('Brak dostępu. Skontaktuj się z administratorem.');
      } else {
        setError(`Błąd logowania (${err.response?.status || '?'}). Sprawdź konsolę przeglądarki (F12).`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-200/50 mb-5">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Witaj w BEST CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Zaloguj się do swojego panelu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
          <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-600 font-medium">Domyślne konto: <span className="font-bold">admin@best.pl</span> / <span className="font-bold">admin123</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Adres e-mail</label>
              <input
                type="email"
                placeholder="np. admin@best.pl"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hasło</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className={`w-full btn-primary shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logowanie...
                </span>
              ) : 'Zaloguj się'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; 2024 BEST CRM System. Dla Stowarzyszenia Studenckiego BEST.
        </p>
      </div>
    </div>
  );
};

export default Login;
