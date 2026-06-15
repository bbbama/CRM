package com.bestcrm.service;

import com.bestcrm.model.*;
import com.bestcrm.repository.EventRepository;
import com.bestcrm.repository.InteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventEditionService {

    private final EventRepository eventRepository;
    private final InteractionRepository interactionRepository;
    private final EventService eventService;

    public List<EventEdition> getEditionsByEventId(Long eventId) {
        return eventRepository.findById(eventId)
                .map(Event::getEditions)
                .orElse(List.of());
    }

    public Optional<EventEdition> getEditionById(Long eventId, Long editionId) {
        return eventRepository.findById(eventId)
                .flatMap(event -> event.getEditions().stream()
                        .filter(e -> e.getId().equals(editionId))
                        .findFirst());
    }

    public EventEdition addEditionToEvent(Long eventId, EventEdition edition) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        event.getEditions().add(edition);
        eventRepository.save(event);
        return edition;
    }

    public Optional<EventEdition> updateEdition(Long eventId, Long editionId, EventEdition edition) {
        return eventRepository.findById(eventId)
                .flatMap(event -> {
                    for (int i = 0; i < event.getEditions().size(); i++) {
                        if (event.getEditions().get(i).getId().equals(editionId)) {
                            EventEdition existing = event.getEditions().get(i);
                            existing.setEdition(edition.getEdition());
                            existing.setStartingDate(edition.getStartingDate());
                            existing.setEndingDate(edition.getEndingDate());
                            existing.setLocalisation(edition.getLocalisation());
                            existing.setDescription(edition.getDescription());
                            eventRepository.save(event);
                            return Optional.of(existing);
                        }
                    }
                    return Optional.empty();
                });
    }

    public boolean deleteEdition(Long eventId, Long editionId) {
        return eventRepository.findById(eventId)
                .map(event -> {
                    boolean removed = event.getEditions().removeIf(e -> e.getId().equals(editionId));
                    if (removed) {
                        eventRepository.save(event);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    public List<ContactAssignment> getAssignments(Long eventId, Long editionId) {
        return getEditionById(eventId, editionId)
                .map(EventEdition::getContactAssignments)
                .orElse(List.of());
    }

    public ContactAssignment addAssignment(Long eventId, Long editionId, Member member) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        EventEdition edition = event.getEditions().stream()
                .filter(e -> e.getId().equals(editionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Edition not found"));

        ContactAssignment assignment = new ContactAssignment();
        assignment.setMember(member);
        edition.getContactAssignments().add(assignment);
        eventRepository.save(event);

        return assignment;
    }

    public boolean removeAssignment(Long eventId, Long editionId, Long assignmentId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        return event.getEditions().stream()
                .filter(e -> e.getId().equals(editionId))
                .findFirst()
                .map(edition -> {
                    boolean removed = edition.getContactAssignments().removeIf(a -> a.getId().equals(assignmentId));
                    if (removed) {
                        eventRepository.save(event);
                    }
                    return removed;
                })
                .orElse(false);
    }

    public ContactAssignment addPartnerToAssignment(Long eventId, Long editionId, Long assignmentId, Partner partner) {
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

        AssignedPartner ap = new AssignedPartner();
        ap.setPartner(partner);
        assignment.getAssignedPartners().add(ap);
        eventRepository.save(event);

        return assignment;
    }

    public boolean removePartnerFromAssignment(Long eventId, Long editionId, Long assignmentId, Long partnerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return event.getEditions().stream()
                .filter(e -> e.getId().equals(editionId))
                .findFirst()
                .flatMap(edition -> edition.getContactAssignments().stream()
                        .filter(a -> a.getId().equals(assignmentId))
                        .findFirst())
                .map(assignment -> {
                    boolean removed = assignment.getAssignedPartners().removeIf(ap -> ap.getPartner().getId().equals(partnerId));
                    if (removed) {
                        eventRepository.save(event);
                    }
                    return removed;
                })
                .orElse(false);
    }

    public AssignedPartner updatePartnerStatus(Long eventId, Long editionId, Long assignmentId, Long partnerId, ParticipationStatus status) {
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

        ap.setStatus(status);
        eventRepository.save(event);
        return ap;
    }

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
