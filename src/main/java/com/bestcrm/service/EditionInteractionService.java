package com.bestcrm.service;

import com.bestcrm.model.*;
import java.util.List;

public interface EditionInteractionService {
    Interaction addInteraction(Long eventId, Long editionId, Long assignmentId, Long partnerId, InteractionType type, String note, Member member);
    List<Interaction> getInteractionsForPartner(Long eventId, Long partnerId);
}
