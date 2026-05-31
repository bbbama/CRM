package com.bestcrm.service;

import com.bestcrm.model.Event;
import com.bestcrm.model.Interaction;
import com.bestcrm.model.Member;
import com.bestcrm.model.Partner;
import com.bestcrm.repository.InteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final MemberService memberService;
    private final PartnerService partnerService;
    private final EventService eventService;

    public List<Interaction> getAllInteractions() {
        return interactionRepository.findAll();
    }

    public Optional<Interaction> getInteractionById(Long id) {
        return interactionRepository.findById(id);
    }

    public Interaction createInteraction(Interaction interaction, String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zalogowanego użytkownika"));

        if (interaction.getPartner() != null && interaction.getPartner().getId() != null) {
            Partner partner = partnerService.getPartnerById(interaction.getPartner().getId())
                    .orElseThrow(() -> new RuntimeException("Partner o ID " + interaction.getPartner().getId() + " nie istnieje"));
            interaction.setPartner(partner);
        }

        if (interaction.getEvent() != null && interaction.getEvent().getId() != null) {
            Event event = eventService.getEventById(interaction.getEvent().getId())
                    .orElseThrow(() -> new RuntimeException("Event o ID " + interaction.getEvent().getId() + " nie istnieje"));
            interaction.setEvent(event);
        }

        interaction.setMember(member);
        return saveInteraction(interaction);
    }

    public Interaction saveInteraction(Interaction interaction) {
        return interactionRepository.save(interaction);
    }

    public boolean deleteInteraction(Long id) {
        if (interactionRepository.existsById(id)) {
            interactionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Interaction> getInteractionsByEvent(Long eventId) {
        return interactionRepository.findByEventId(eventId);
    }

    public List<Interaction> getInteractionsByPartner(Long partnerId) {
        return interactionRepository.findAllInteractionsForPartner(partnerId);
    }
}
