package com.bestcrm.service;

import com.bestcrm.model.*;
import com.bestcrm.repository.EventRepository;
import com.bestcrm.repository.InteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EditionInteractionServiceImpl implements EditionInteractionService {

    private final EventRepository eventRepository;
    private final InteractionRepository interactionRepository;
    private final EventService eventService;

    public Interaction addInteraction(Long eventId, Long editionId, Long assignmentId, Long partnerId, InteractionType type, String note, Member member) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventEdition edition = event.getEditions().stream()
                .filter(e -> e.getId().equals(editionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Edition not found"));

        ContactAssignment assignment = edition.getContactAssignments().stream()
                .filter(a -> a.getId().equals(assignmentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        AssignedPartner ap = assignment.getAssignedPartners().stream()
                .filter(a -> a.getPartner().getId().equals(partnerId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Partner not found in assignment"));

        Interaction interaction = new Interaction();
        interaction.setType(type);
        interaction.setNote(note);
        interaction.setDate(LocalDateTime.now());
        interaction.setPartner(ap.getPartner());
        interaction.setMember(member);
        interaction.setEvent(eventService.getEventById(eventId).orElse(null));
        interaction.setStatus(CooperationStatus.IN_PROGRESS);

        return interactionRepository.save(interaction);
    }

    public List<Interaction> getInteractionsForPartner(Long eventId, Long partnerId) {
        return interactionRepository.findByEventIdAndPartnerId(eventId, partnerId);
    }
}
