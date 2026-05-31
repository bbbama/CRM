import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partnerService } from '../services/api';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await partnerService.getAll();
      setPartners(res.data);
    } catch (err) {
      console.error("Błąd pobierania partnerów", err);
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await partnerService.create({ name, industry, status: 'POTENTIAL' });
      setName('');
      setIndustry('');
      fetchPartners();
    } catch (err) {
      alert("Błąd podczas dodawania partnera");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Partnerami</h2>
      
      {/* Formularz dodawania */}
      <form onSubmit={handleAddPartner} className="bg-white p-6 rounded-lg shadow-sm mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa firmy</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            required 
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Branża</label>
          <input 
            value={industry} 
            onChange={e => setIndustry(e.target.value)} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
            required 
          />
        </div>
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold">
          Dodaj Firmę
        </button>
      </form>

      {/* Tabela Partnerów */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nazwa</th>
              <th className="p-4 font-semibold text-gray-600">Branża</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">
                  <Link to={`/partners/${p.id}`} className="text-indigo-600 hover:text-indigo-900 font-bold">
                    {p.name}
                  </Link>
                </td>
                <td className="p-4 text-gray-600">{p.industry}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && (
          <div className="p-8 text-center text-gray-500">Brak zarejestrowanych partnerów.</div>
        )}
      </div>
    </div>
  );
};

export default Partners;
