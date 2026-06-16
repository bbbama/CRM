package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventEdition extends BaseEntity {
    private Integer edition;
    private LocalDate startingDate;
    private LocalDate endingDate;
    private String localisation;
    private String description;

    @Relationship(type = "HAS_ASSIGNMENT", cascadeUpdates = true)
    private List<ContactAssignment> contactAssignments = new ArrayList<>();
}
