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
public class Event extends BaseEntity {
    private String name;

    @Relationship(type = "HAS_EDITION", cascadeUpdates = true)
    private List<EventEdition> editions = new ArrayList<>();

    @Relationship(type = "PARTNER_OF", direction = Relationship.Direction.INCOMING)
    private List<PartnerOf> partnerRelationships;
}
