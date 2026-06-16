package com.bestcrm.service;

import com.bestcrm.model.*;
import com.bestcrm.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final EventRepository eventRepository;
    private final EditionService editionService;

    public List<ContactAssignment> getAssignments(Long eventId, Long editionId) {
        return editionService.getEditionById(eventId, editionId)
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
}
