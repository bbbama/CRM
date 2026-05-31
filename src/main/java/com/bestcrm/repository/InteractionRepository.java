package com.bestcrm.repository;

import com.bestcrm.model.Interaction;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.neo4j.repository.query.Query;

@Repository
public interface InteractionRepository extends Neo4jRepository<Interaction, Long> {
    
    // Wyszukiwanie wszystkich interakcji powiązanych z konkretnym wydarzeniem
    List<Interaction> findByEventId(Long eventId);

    @Query("MATCH (i:Interaction)-[:WITH_PARTNER]->(p:Partner) WHERE p.id = $partnerId " +
           "RETURN i ORDER BY i.date DESC")
    List<Interaction> findAllInteractionsForPartner(Long partnerId);
}
