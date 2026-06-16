package com.bestcrm.service;

import com.bestcrm.model.Interaction;
import java.util.List;
import java.util.Optional;

public interface InteractionService {
    List<Interaction> getAllInteractions();
    Optional<Interaction> getInteractionById(Long id);
    Interaction createInteraction(Interaction interaction, String userEmail);
    Interaction saveInteraction(Interaction interaction);
    boolean deleteInteraction(Long id);
    List<Interaction> getInteractionsByEvent(Long eventId);
    List<Interaction> getInteractionsByPartner(Long partnerId);
}
