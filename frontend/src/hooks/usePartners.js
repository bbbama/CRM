import { useState, useEffect, useMemo } from 'react';
import { partnerService } from '../services/api';

export const usePartners = () => {
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const res = await partnerService.getAll();
      setPartners(res.data);
    } catch (err) {
      console.error('Błąd pobierania partnerów', err);
    }
  };

  const addPartner = async (e) => {
    e.preventDefault();
    try {
      await partnerService.create({ name: newName, industry: newIndustry, status: 'POTENTIAL' });
      setNewName('');
      setNewIndustry('');
      setShowQuickAdd(false);
      fetchPartners();
    } catch (err) {
      alert('Błąd podczas dodawania firmy.');
    }
  };

  const deletePartner = async (id, name) => {
    if (window.confirm(`Czy na pewno chcesz usunąć firmę "${name}"?`)) {
      try {
        await partnerService.delete(id);
        fetchPartners();
      } catch (err) {
        alert('Błąd podczas usuwania. Tylko administrator może usunąć firmę.');
      }
    }
  };

  const filteredPartners = useMemo(() =>
    partners.filter(p =>
      p.name && (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.industry || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    ), [partners, searchTerm]
  );

  return {
    partners: filteredPartners,
    searchTerm, setSearchTerm,
    newName, setNewName,
    newIndustry, setNewIndustry,
    showQuickAdd, setShowQuickAdd,
    addPartner, deletePartner, fetchPartners,
  };
};
