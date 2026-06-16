package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignedPartner extends BaseEntity {
    @TargetNode
    private Partner partner;

    private ParticipationStatus status = ParticipationStatus.IN_PROGRESS;
}
