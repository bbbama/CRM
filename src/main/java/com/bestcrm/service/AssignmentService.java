package com.bestcrm.service;

import com.bestcrm.model.*;
import java.util.List;

public interface AssignmentService {
    List<ContactAssignment> getAssignments(Long eventId, Long editionId);
    ContactAssignment addAssignment(Long eventId, Long editionId, Member member);
    boolean removeAssignment(Long eventId, Long editionId, Long assignmentId);
    ContactAssignment addPartnerToAssignment(Long eventId, Long editionId, Long assignmentId, Partner partner);
    boolean removePartnerFromAssignment(Long eventId, Long editionId, Long assignmentId, Long partnerId);
    AssignedPartner updatePartnerStatus(Long eventId, Long editionId, Long assignmentId, Long partnerId, ParticipationStatus status);
}
