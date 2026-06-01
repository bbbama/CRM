package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyContact {
    @Id
    @GeneratedValue
    private Long id;
    
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String position;
    private String linkedinUrl;

    @Relationship(type = "WORKS_FOR")
    private Partner employer;
}
