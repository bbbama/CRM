package com.bestcrm.controller;

import com.bestcrm.model.EventEdition;
import com.bestcrm.service.EventEditionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/editions")
@RequiredArgsConstructor
public class EventEditionController {

    private final EventEditionService editionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<EventEdition>> getAll(@PathVariable Long eventId) {
        return ResponseEntity.ok(editionService.getEditionsByEventId(eventId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<EventEdition> getById(@PathVariable Long eventId, @PathVariable Long id) {
        return editionService.getEditionById(eventId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventEdition> create(@PathVariable Long eventId, @RequestBody EventEdition edition) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(editionService.addEditionToEvent(eventId, edition));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventEdition> update(@PathVariable Long eventId, @PathVariable Long id,
                                                @RequestBody EventEdition edition) {
        return editionService.updateEdition(eventId, id, edition)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long eventId, @PathVariable Long id) {
        if (editionService.deleteEdition(eventId, id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
