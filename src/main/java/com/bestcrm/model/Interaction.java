package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDateTime;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interaction {
    @Id
    @GeneratedValue
    private Long id;
    
    private InteractionType type;
    private LocalDateTime date;
    private String note;
    private CooperationStatus status;
    private boolean isResponsive;

    @Relationship(type = "WITH_CONTACT")
    private CompanyContact contact;

    @Relationship(type = "WITH_PARTNER")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("eventRelationships")
    private Partner partner;

    @Relationship(type = "REGARDING")
    private Event event;

    @Relationship(type = "PERFORMED_BY")
    private Member member;
}
