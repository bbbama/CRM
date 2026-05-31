package com.bestcrm.controller;

import com.bestcrm.model.Partner;
import com.bestcrm.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<Partner>> getAll() {
        return ResponseEntity.ok(partnerService.getAllPartners());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<Partner> getById(@PathVariable Long id) {
        return partnerService.getPartnerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ResponseEntity<Partner> create(@RequestBody Partner partner) {
        Partner savedPartner = partnerService.savePartner(partner);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPartner);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Partner> update(@PathVariable Long id, @RequestBody Partner partner) {
        return partnerService.getPartnerById(id)
                .map(existing -> {
                    existing.setName(partner.getName());
                    existing.setWebPage(partner.getWebPage());
                    existing.setIndustry(partner.getIndustry());
                    existing.setStatus(partner.getStatus());
                    return ResponseEntity.ok(partnerService.savePartner(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (partnerService.deletePartner(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<Partner>> search(@RequestParam String name) {
        return ResponseEntity.ok(partnerService.searchPartnersByName(name));
    }

    @GetMapping("/industry/{industry}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER', 'GUEST')")
    public ResponseEntity<List<Partner>> getByIndustry(@PathVariable String industry) {
        return ResponseEntity.ok(partnerService.getPartnersByIndustry(industry));
    }
}
