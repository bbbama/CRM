package com.bestcrm.controller;

import com.bestcrm.annotation.MemberOrAdmin;
import com.bestcrm.annotation.ReadAccess;
import com.bestcrm.model.*;
import com.bestcrm.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events/{eventId}/editions")
@RequiredArgsConstructor
public class EventEditionController {

    private final EditionService editionService;
    private final AssignmentService assignmentService;
    private final EditionInteractionService editionInteractionService;
    private final PartnerService partnerService;
    private final MemberService memberService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<EventEdition>> getAll(@PathVariable Long eventId) {
        return ResponseEntity.ok(editionService.getEditionsByEventId(eventId));
    }

    @GetMapping("/{id}")
    @ReadAccess
    public ResponseEntity<EventEdition> getById(@PathVariable Long eventId, @PathVariable Long id) {
        return editionService.getEditionById(eventId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @MemberOrAdmin
    public ResponseEntity<EventEdition> create(@PathVariable Long eventId, @RequestBody EventEdition edition) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(editionService.addEditionToEvent(eventId, edition));
    }

    @PutMapping("/{id}")
    @MemberOrAdmin
    public ResponseEntity<EventEdition> update(@PathVariable Long eventId, @PathVariable Long id,
                                                @RequestBody EventEdition edition) {
        return editionService.updateEdition(eventId, id, edition)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @MemberOrAdmin
    public ResponseEntity<Void> delete(@PathVariable Long eventId, @PathVariable Long id) {
        if (editionService.deleteEdition(eventId, id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{editionId}/assignments")
    @ReadAccess
    public ResponseEntity<List<ContactAssignment>> getAssignments(
            @PathVariable Long eventId,
            @PathVariable Long editionId) {
        return ResponseEntity.ok(assignmentService.getAssignments(eventId, editionId));
    }

    @PostMapping("/{editionId}/assignments")
    @MemberOrAdmin
    public ResponseEntity<ContactAssignment> addAssignment(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @RequestBody Map<String, Long> body) {
        Long memberId = body.get("memberId");
        if (memberId == null) {
            return ResponseEntity.badRequest().build();
        }
        Member member = memberService.getMemberById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        ContactAssignment assignment = assignmentService.addAssignment(eventId, editionId, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @DeleteMapping("/{editionId}/assignments/{assignmentId}")
    @MemberOrAdmin
    public ResponseEntity<Void> removeAssignment(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId) {
        if (assignmentService.removeAssignment(eventId, editionId, assignmentId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{editionId}/assignments/{assignmentId}/partners")
    @MemberOrAdmin
    public ResponseEntity<ContactAssignment> addPartner(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId,
            @RequestBody Map<String, Long> body) {
        Long partnerId = body.get("partnerId");
        if (partnerId == null) {
            return ResponseEntity.badRequest().build();
        }
        Partner partner = partnerService.getPartnerById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        ContactAssignment assignment = assignmentService.addPartnerToAssignment(eventId, editionId, assignmentId, partner);
        return ResponseEntity.ok(assignment);
    }

    @DeleteMapping("/{editionId}/assignments/{assignmentId}/partners/{partnerId}")
    @MemberOrAdmin
    public ResponseEntity<Void> removePartner(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId,
            @PathVariable Long partnerId) {
        if (assignmentService.removePartnerFromAssignment(eventId, editionId, assignmentId, partnerId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{editionId}/assignments/{assignmentId}/partners/{partnerId}/status")
    @MemberOrAdmin
    public ResponseEntity<AssignedPartner> updatePartnerStatus(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId,
            @PathVariable Long partnerId,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        ParticipationStatus status = ParticipationStatus.valueOf(statusStr);
        AssignedPartner ap = assignmentService.updatePartnerStatus(eventId, editionId, assignmentId, partnerId, status);
        return ResponseEntity.ok(ap);
    }

    @GetMapping("/{editionId}/assignments/{assignmentId}/partners/{partnerId}/interactions")
    @ReadAccess
    public ResponseEntity<List<Interaction>> getInteractions(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId,
            @PathVariable Long partnerId) {
        return ResponseEntity.ok(editionInteractionService.getInteractionsForPartner(eventId, partnerId));
    }

    @PostMapping("/{editionId}/assignments/{assignmentId}/partners/{partnerId}/interactions")
    @MemberOrAdmin
    public ResponseEntity<Interaction> addInteraction(
            @PathVariable Long eventId,
            @PathVariable Long editionId,
            @PathVariable Long assignmentId,
            @PathVariable Long partnerId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String typeStr = body.get("type");
        String note = body.get("note");
        if (typeStr == null) {
            return ResponseEntity.badRequest().build();
        }
        InteractionType type = InteractionType.valueOf(typeStr);
        Member member = memberService.getMemberByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Interaction interaction = editionInteractionService.addInteraction(eventId, editionId, assignmentId, partnerId, type, note, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(interaction);
    }
}
