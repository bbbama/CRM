package com.bestcrm.controller;

import com.bestcrm.annotation.AdminOnly;
import com.bestcrm.model.Member;
import com.bestcrm.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    @com.bestcrm.annotation.MemberOrAdmin
    public ResponseEntity<List<Member>> getAll() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    @com.bestcrm.annotation.MemberOrAdmin
    public ResponseEntity<Member> getById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @com.bestcrm.annotation.AdminOnly
    public ResponseEntity<Member> create(@RequestBody Member member) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.saveMember(member));
    }

    @PutMapping("/{id}")
    @com.bestcrm.annotation.AdminOnly
    public ResponseEntity<Member> update(@PathVariable Long id, @RequestBody Member member) {
        // ... (existing logic)
        return memberService.getMemberById(id)
                .map(existing -> {
                    existing.setFirstName(member.getFirstName());
                    existing.setLastName(member.getLastName());
                    existing.setEmail(member.getEmail());
                    existing.setRole(member.getRole());
                    if (member.getPassword() != null && !member.getPassword().isBlank()) {
                        existing.setPassword(member.getPassword());
                    }
                    return ResponseEntity.ok(memberService.saveMember(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @com.bestcrm.annotation.AdminOnly
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (memberService.deleteMember(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
