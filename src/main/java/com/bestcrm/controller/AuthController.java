package com.bestcrm.controller;

import com.bestcrm.dto.AuthRequest;
import com.bestcrm.dto.AuthResponse;
import com.bestcrm.model.Member;
import com.bestcrm.model.Role;
import com.bestcrm.security.JwtService;
import com.bestcrm.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final MemberService memberService;

    @PostMapping("/register")
    public ResponseEntity<Member> register(@RequestBody Member member) {
        member.setRole(Role.MEMBER);
        return ResponseEntity.ok(memberService.saveMember(member));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final Member member = (Member) userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtService.generateToken(member);
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .role(member.getRole().name())
                .build());
    }
}
