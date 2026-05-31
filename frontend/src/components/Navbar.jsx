import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => (
  <nav className="bg-indigo-600 text-white p-4 shadow-lg mb-8">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">BEST CRM</Link>
      <div className="space-x-6">
        <Link to="/partners" className="hover:text-indigo-200">Partnerzy</Link>
        <Link to="/events" className="hover:text-indigo-200">Wydarzenia</Link>
        <Link to="/users" className="hover:text-indigo-200">Użytkownicy</Link>
        <button 
          onClick={onLogout} 
          className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition"
        >
          Wyloguj
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
