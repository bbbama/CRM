package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.time.LocalDate;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventEdition {
    @Id
    @GeneratedValue
    private Long id;
    private Integer edition;
    private LocalDate startingDate;
    private LocalDate endingDate;
    private String localisation;
    private String description;
}
