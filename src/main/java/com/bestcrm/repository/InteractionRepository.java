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

    List<Interaction> findByPartnerIdOrderByDateDesc(Long partnerId);

    List<Interaction> findByEventIdAndPartnerId(Long eventId, Long partnerId);
}
