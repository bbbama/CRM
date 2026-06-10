import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/partners', label: 'Partnerzy', icon: '🏢' },
  { path: '/events', label: 'Wydarzenia', icon: '📅' },
  { path: '/users', label: 'Zespół', icon: '👥' },
];

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/partners') return location.pathname === '/partners' || location.pathname.startsWith('/partners/');
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              BEST<span className="text-indigo-600">CRM</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive(path)
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-red-50"
            >
              Wyloguj
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border-2 border-white">
              AD
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around px-2 pb-2 pt-1 border-t border-gray-100">
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isActive(path)
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
