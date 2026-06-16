package com.bestcrm.controller;

import com.bestcrm.annotation.AdminOnly;
import com.bestcrm.annotation.ReadAccess;
import com.bestcrm.model.Event;
import com.bestcrm.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<Event>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    @ReadAccess
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @AdminOnly
    public ResponseEntity<Event> create(@RequestBody Event event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.saveEvent(event));
    }

    @PutMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Event> update(@PathVariable Long id, @RequestBody Event event) {
        return eventService.getEventById(id)
                .map(existing -> {
                    existing.setName(event.getName());
                    return ResponseEntity.ok(eventService.saveEvent(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (eventService.deleteEvent(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
