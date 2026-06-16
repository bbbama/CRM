package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDateTime;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactNote extends BaseEntity {
    private String content;
    private LocalDateTime createdAt;

    @Relationship(type = "ADDED_BY")
    private Member author;
}
