package com.bestcrm.service;

import com.bestcrm.model.Event;
import java.util.List;
import java.util.Optional;

public interface EventService {
    List<Event> getAllEvents();
    Optional<Event> getEventById(Long id);
    Event saveEvent(Event event);
    boolean deleteEvent(Long id);
    List<Event> searchEventsByName(String name);
}
