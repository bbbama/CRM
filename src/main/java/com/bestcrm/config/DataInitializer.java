package com.bestcrm.config;

import com.bestcrm.model.Member;
import com.bestcrm.model.Role;
import com.bestcrm.repository.MemberRepository;
import com.bestcrm.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final MemberService memberService;

    @Override
    public void run(String... args) {
        if (memberRepository.findByEmail("admin@best.pl").isEmpty()) {
            Member admin = new Member();
            admin.setFirstName("Główny");
            admin.setLastName("Administrator");
            admin.setEmail("admin@best.pl");
            admin.setPassword("admin123"); // Zostanie zaszyfrowane w serwisie
            admin.setRole(Role.ADMIN);
            
            memberService.saveMember(admin);
            log.info("Utworzono domyślne konto administratora: admin@best.pl / admin123");
        } else {
            log.info("Konto administratora już istnieje.");
        }
    }
}
