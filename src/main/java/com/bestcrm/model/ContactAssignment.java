package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactAssignment extends BaseEntity {
    @Relationship(type = "ASSIGNED_TO")
    private Member member;

    @Relationship(type = "CONTACTED_PARTNER", cascadeUpdates = true)
    private List<AssignedPartner> assignedPartners = new ArrayList<>();
}
