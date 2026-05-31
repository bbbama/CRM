package com.bestcrm.repository;

import com.bestcrm.model.CompanyContact;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyContactRepository extends Neo4jRepository<CompanyContact, Long> {
    
    // Znajdź wszystkich pracowników danej firmy
    List<CompanyContact> findByEmployerId(Long partnerId);
    
    // Wyszukiwanie po nazwisku
    List<CompanyContact> findByLastNameContainingIgnoreCase(String lastName);
}
