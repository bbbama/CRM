package com.bestcrm.controller;

import com.bestcrm.annotation.AdminOnly;
import com.bestcrm.annotation.MemberOrAdmin;
import com.bestcrm.annotation.ReadAccess;
import com.bestcrm.model.Partner;
import com.bestcrm.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<Partner>> getAll() {
        return ResponseEntity.ok(partnerService.getAllPartners());
    }

    @GetMapping("/{id}")
    @ReadAccess
    public ResponseEntity<Partner> getById(@PathVariable Long id) {
        return partnerService.getPartnerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @MemberOrAdmin
    public ResponseEntity<Partner> create(@RequestBody Partner partner) {
        Partner savedPartner = partnerService.savePartner(partner);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPartner);
    }

    @PutMapping("/{id}")
    @AdminOnly
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
    @AdminOnly
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (partnerService.deletePartner(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    @ReadAccess
    public ResponseEntity<List<Partner>> search(@RequestParam String name) {
        return ResponseEntity.ok(partnerService.searchPartnersByName(name));
    }

    @GetMapping("/industry/{industry}")
    @ReadAccess
    public ResponseEntity<List<Partner>> getByIndustry(@PathVariable String industry) {
        return ResponseEntity.ok(partnerService.getPartnersByIndustry(industry));
    }
}
