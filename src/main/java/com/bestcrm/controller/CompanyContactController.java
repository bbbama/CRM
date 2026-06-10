package com.bestcrm.controller;

import com.bestcrm.model.CompanyContact;
import com.bestcrm.service.CompanyContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class CompanyContactController {

    private final CompanyContactService contactService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<CompanyContact>> getAll() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<CompanyContact> getById(@PathVariable Long id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ResponseEntity<CompanyContact> create(@RequestBody CompanyContact contact) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.saveContact(contact));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ResponseEntity<CompanyContact> update(@PathVariable Long id, @RequestBody CompanyContact contact) {
        return contactService.getContactById(id)
                .map(existing -> {
                    existing.setFirstName(contact.getFirstName());
                    existing.setLastName(contact.getLastName());
                    existing.setEmail(contact.getEmail());
                    existing.setPhoneNumber(contact.getPhoneNumber());
                    existing.setPosition(contact.getPosition());
                    existing.setNote(contact.getNote());
                    if (contact.getEmployer() != null && contact.getEmployer().getId() != null) {
                        existing.setEmployer(contact.getEmployer());
                    }
                    return ResponseEntity.ok(contactService.saveContact(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (contactService.deleteContact(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/partner/{partnerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<CompanyContact>> getByPartner(@PathVariable Long partnerId) {
        return ResponseEntity.ok(contactService.getContactsByPartner(partnerId));
    }
}
