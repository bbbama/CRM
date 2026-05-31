package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Partner {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String webPage;
    private String industry;
    private PartnerStatus status;

    @Relationship(type = "PARTNER_OF")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<PartnerOf> eventRelationships;

    @Relationship(type = "ACQUIRED_AT")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Event sourceEvent;
}
