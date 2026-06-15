import { useState, useEffect } from 'react';
import { eventService, editionService, partnerService, memberService } from '../services/api';

export const useEditionDetails = (eventId, editionId) => {
  const [event, setEvent] = useState(null);
  const [edition, setEdition] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [partnerSelections, setPartnerSelections] = useState({});

  useEffect(() => { fetchData(); }, [eventId, editionId]);

  const fetchData = async () => {
    try {
      const [eventRes, membersRes, partnersRes, assignmentsRes] = await Promise.all([
        eventService.getById(eventId),
        memberService.getAll(),
        partnerService.getAll(),
        editionService.getAssignments(eventId, editionId),
      ]);
      setEvent(eventRes.data);
      setMembers(membersRes.data);
      setPartners(partnersRes.data);
      setAssignments(assignmentsRes.data);

      const editionRes = await editionService.getById(eventId, editionId);
      setEdition(editionRes.data);
    } catch (err) {
      console.error('Błąd pobierania danych', err);
    }
  };

  const addAssignment = async () => {
    if (!selectedMember) return;
    try {
      await editionService.addAssignment(eventId, editionId, Number(selectedMember));
      setSelectedMember('');
      fetchData();
    } catch (err) {
      alert('Błąd dodawania użytkownika.');
    }
  };

  const removeAssignment = async (assignmentId) => {
    try {
      await editionService.removeAssignment(eventId, editionId, assignmentId);
      fetchData();
    } catch (err) {
      alert('Błąd usuwania użytkownika.');
    }
  };

  const addPartner = async (assignmentId) => {
    const partnerId = partnerSelections[assignmentId];
    if (!partnerId) return;
    try {
      await editionService.addPartnerToAssignment(eventId, editionId, assignmentId, Number(partnerId));
      setPartnerSelections(prev => ({ ...prev, [assignmentId]: '' }));
      fetchData();
    } catch (err) {
      alert('Błąd dodawania firmy.');
    }
  };

  const removePartner = async (assignmentId, partnerId) => {
    try {
      await editionService.removePartnerFromAssignment(eventId, editionId, assignmentId, partnerId);
      fetchData();
    } catch (err) {
      alert('Błąd usuwania firmy.');
    }
  };

  const updateStatus = async (assignmentId, partnerId, status) => {
    try {
      await editionService.updatePartnerStatus(eventId, editionId, assignmentId, partnerId, status);
      fetchData();
    } catch (err) {
      alert('Błąd aktualizacji statusu.');
    }
  };

  return {
    event, edition, assignments, members, partners,
    selectedMember, setSelectedMember,
    partnerSelections, setPartnerSelections,
    addAssignment, removeAssignment,
    addPartner, removePartner, updateStatus,
  };
};
