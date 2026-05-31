package com.bestcrm.repository;

import com.bestcrm.model.Member;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.bestcrm.model.Partner;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends Neo4jRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    @Query("MATCH (m:Member)-[:RESPONSIBLE_FOR]->(p:Partner) WHERE m.id = $memberId RETURN p")
    List<Partner> findAssignedPartners(Long memberId);
}
