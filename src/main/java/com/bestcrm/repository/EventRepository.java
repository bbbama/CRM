package com.bestcrm.repository;

import com.bestcrm.model.Event;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends Neo4jRepository<Event, Long> {
    
    // Wyszukiwanie wydarzeń po nazwie
    List<Event> findByNameContainingIgnoreCase(String name);

}
