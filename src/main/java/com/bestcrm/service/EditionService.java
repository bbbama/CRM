package com.bestcrm.service;

import com.bestcrm.model.EventEdition;
import java.util.List;
import java.util.Optional;

public interface EditionService {
    List<EventEdition> getEditionsByEventId(Long eventId);
    Optional<EventEdition> getEditionById(Long eventId, Long editionId);
    EventEdition addEditionToEvent(Long eventId, EventEdition edition);
    Optional<EventEdition> updateEdition(Long eventId, Long editionId, EventEdition edition);
    boolean deleteEdition(Long eventId, Long editionId);
}
