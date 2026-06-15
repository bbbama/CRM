package com.bestcrm.service;

import com.bestcrm.model.Event;
import com.bestcrm.model.EventEdition;
import com.bestcrm.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventEditionService {

    private final EventRepository eventRepository;

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
}
