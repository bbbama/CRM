package com.bestcrm.repository;

import com.bestcrm.model.Partner;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerRepository extends Neo4jRepository<Partner, Long> {

    List<Partner> findByIndustry(String industry);

    List<Partner> findByNameContainingIgnoreCase(String name);
}
