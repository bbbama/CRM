package com.bestcrm.controller;

import com.bestcrm.annotation.AdminOnly;
import com.bestcrm.annotation.MemberOrAdmin;
import com.bestcrm.annotation.ReadAccess;
import com.bestcrm.model.Interaction;
import com.bestcrm.service.InteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<Interaction>> getAll() {
        return ResponseEntity.ok(interactionService.getAllInteractions());
    }

    @GetMapping("/{id}")
    @ReadAccess
    public ResponseEntity<Interaction> getById(@PathVariable Long id) {
        return interactionService.getInteractionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @MemberOrAdmin
    public ResponseEntity<Interaction> create(@RequestBody Interaction interaction, Authentication authentication) {
        Interaction saved = interactionService.createInteraction(interaction, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (interactionService.deleteInteraction(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/event/{eventId}")
    @ReadAccess
    public ResponseEntity<List<Interaction>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(interactionService.getInteractionsByEvent(eventId));
    }

    @GetMapping("/partner/{partnerId}")
    @ReadAccess
    public ResponseEntity<List<Interaction>> getByPartner(@PathVariable Long partnerId) {
        return ResponseEntity.ok(interactionService.getInteractionsByPartner(partnerId));
    }
}
