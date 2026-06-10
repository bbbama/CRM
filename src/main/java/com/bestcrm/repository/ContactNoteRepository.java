package com.bestcrm.repository;

import com.bestcrm.model.ContactNote;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactNoteRepository extends Neo4jRepository<ContactNote, Long> {

    List<ContactNote> findByContactIdOrderByCreatedAtDesc(Long contactId);
}
