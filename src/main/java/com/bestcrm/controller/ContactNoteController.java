package com.bestcrm.controller;

import com.bestcrm.annotation.AdminOnly;
import com.bestcrm.annotation.ReadAccess;
import com.bestcrm.model.ContactNote;
import com.bestcrm.service.ContactNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts/{contactId}/notes")
@RequiredArgsConstructor
public class ContactNoteController {

    private final ContactNoteService contactNoteService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<ContactNote>> getNotes(@PathVariable Long contactId) {
        return ResponseEntity.ok(contactNoteService.getNotesByContact(contactId));
    }

    @PostMapping
    @ReadAccess
    public ResponseEntity<ContactNote> addNote(@PathVariable Long contactId,
                                                @RequestBody Map<String, String> body,
                                                Authentication authentication) {
        String content = body.get("content");
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ContactNote saved = contactNoteService.addNote(contactId, content, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{noteId}")
    @AdminOnly
    public ResponseEntity<Void> deleteNote(@PathVariable Long contactId, @PathVariable Long noteId) {
        if (contactNoteService.deleteNote(contactId, noteId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
