import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout, role }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
            B
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">BEST<span className="text-indigo-600">CRM</span></span>
        </Link>

        {/* NAWIGACJA */}
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            to="/partners" 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isActive('/partners') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Partnerzy
          </Link>
          <Link 
            to="/events" 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isActive('/events') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Wydarzenia
          </Link>
          {role === 'ADMIN' && (
            <Link 
              to="/users" 
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isActive('/users') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Użytkownicy
            </Link>
          )}
        </div>

        {/* AKCJE PROFILU */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogout} 
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition uppercase tracking-widest"
          >
            Wyloguj
          </button>
          <div className="w-10 h-10 bg-indigo-100 border-2 border-white shadow-sm rounded-full flex items-center justify-center text-indigo-700 font-bold">
            AD
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
