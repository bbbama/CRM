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
public class ContactNote {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private LocalDateTime createdAt;

    @Relationship(type = "ABOUT_CONTACT")
    private CompanyContact contact;

    @Relationship(type = "ADDED_BY")
    private Member author;
}
